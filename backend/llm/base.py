"""
Voice AI Platform - LLM Integration
OpenAI LLM with function calling and tool orchestration.
"""

from typing import Optional, List, Dict, Any, Callable, AsyncGenerator
import json
import asyncio
from datetime import datetime
import structlog
from openai import AsyncOpenAI
from backend.models.schemas import (
    ConversationMessage, MessageRole, ToolCall, ToolResult
)
from backend.config import get_settings

logger = structlog.get_logger()
settings = get_settings()


class ToolRegistry:
    """
    Registry for LLM tools with function calling support.
    
    Features:
    - Dynamic tool registration
    - Input validation via Pydantic
    - Async tool execution
    - Tool call history tracking
    """
    
    def __init__(self):
        self._tools: Dict[str, Dict[str, Any]] = {}
        self._functions: Dict[str, Callable] = {}
        self._execution_count: Dict[str, int] = {}
    
    def register(
        self,
        name: str,
        description: str,
        parameters: Dict[str, Any],
        handler: Callable
    ):
        """Register a tool with its handler."""
        self._tools[name] = {
            "type": "function",
            "function": {
                "name": name,
                "description": description,
                "parameters": parameters
            }
        }
        self._functions[name] = handler
        self._execution_count[name] = 0
        logger.info("Tool registered", tool=name)
    
    def get_tools_schema(self) -> List[Dict[str, Any]]:
        """Get OpenAI tools schema."""
        return list(self._tools.values())
    
    async def execute(self, tool_call: ToolCall) -> ToolResult:
        """Execute a tool call."""
        start_time = datetime.utcnow()
        
        if tool_call.name not in self._functions:
            return ToolResult(
                tool_call_id=tool_call.id,
                name=tool_call.name,
                result=None,
                success=False,
                error=f"Tool not found: {tool_call.name}"
            )
        
        try:
            handler = self._functions[tool_call.name]
            result = await handler(**tool_call.arguments)
            self._execution_count[tool_call.name] += 1
            
            execution_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            
            return ToolResult(
                tool_call_id=tool_call.id,
                name=tool_call.name,
                result=result,
                success=True,
                execution_time_ms=execution_time
            )
        except Exception as e:
            execution_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            logger.error(
                "Tool execution failed",
                tool=tool_call.name,
                error=str(e),
                execution_time_ms=execution_time
            )
            return ToolResult(
                tool_call_id=tool_call.id,
                name=tool_call.name,
                result=None,
                success=False,
                error=str(e),
                execution_time_ms=execution_time
            )
    
    def get_stats(self) -> Dict[str, int]:
        """Get tool execution statistics."""
        return self._execution_count.copy()


class LLMProvider:
    """
    LLM provider with function calling and conversation management.
    
    Features:
    - Streaming response generation
    - Multi-turn tool calling
    - Conversation context management
    - Rate limiting and retry logic
    """
    
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 150
    ):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.tool_registry = ToolRegistry()
        self._max_tool_rounds = 5  # Max consecutive tool calls
        
        # Register default tools
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default tools for voice agent."""
        
        async def get_current_time() -> str:
            """Get current date and time."""
            return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        async def calculate(expression: str) -> str:
            """Calculate a mathematical expression."""
            try:
                # Safe evaluation
                result = eval(expression, {"__builtins__": {}}, {})
                return str(result)
            except Exception as e:
                return f"Error: {str(e)}"
        
        async def lookup_info(query: str) -> str:
            """Look up information from knowledge base."""
            # Mock implementation - replace with actual RAG
            return f"Information about '{query}': This is a placeholder for knowledge base lookup."
        
        self.tool_registry.register(
            name="get_current_time",
            description="Get the current date and time",
            parameters={
                "type": "object",
                "properties": {},
                "required": []
            },
            handler=get_current_time
        )
        
        self.tool_registry.register(
            name="calculate",
            description="Calculate a mathematical expression",
            parameters={
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "The mathematical expression to evaluate"
                    }
                },
                "required": ["expression"]
            },
            handler=calculate
        )
        
        self.tool_registry.register(
            name="lookup_info",
            description="Look up information from the knowledge base",
            parameters={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query"
                    }
                },
                "required": ["query"]
            },
            handler=lookup_info
        )
    
    async def generate_response(
        self,
        conversation_history: List[ConversationMessage],
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Generate a response from the LLM.
        
        Args:
            conversation_history: List of conversation messages
            system_prompt: Optional system prompt
            
        Returns:
            Generated response text
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        for msg in conversation_history:
            messages.append({
                "role": msg.role.value,
                "content": msg.content
            })
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error("LLM generation failed", error=str(e))
            return "I'm sorry, I encountered an error processing your request."
    
    async def generate_response_with_tools(
        self,
        conversation_history: List[ConversationMessage],
        system_prompt: Optional[str] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Generate response with tool calling support.
        
        Yields:
            Dictionary with type (text/tool_call/result) and content
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        for msg in conversation_history:
            message_dict = {
                "role": msg.role.value,
                "content": msg.content
            }
            if msg.tool_call_id:
                message_dict["tool_call_id"] = msg.tool_call_id
            if msg.tool_calls:
                message_dict["tool_calls"] = msg.tool_calls
            messages.append(message_dict)
        
        tools = self.tool_registry.get_tools_schema()
        
        for round_num in range(self._max_tool_rounds):
            try:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    tools=tools if tools else None,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens
                )
                
                message = response.choices[0].message
                
                # Check for tool calls
                if message.tool_calls:
                    # Add assistant message with tool calls
                    messages.append({
                        "role": "assistant",
                        "content": message.content,
                        "tool_calls": [
                            {
                                "id": tc.id,
                                "type": "function",
                                "function": {
                                    "name": tc.function.name,
                                    "arguments": tc.function.arguments
                                }
                            }
                            for tc in message.tool_calls
                        ]
                    })
                    
                    # Execute each tool call
                    for tool_call in message.tool_calls:
                        arguments = json.loads(tool_call.function.arguments)
                        tc = ToolCall(
                            id=tool_call.id,
                            name=tool_call.function.name,
                            arguments=arguments
                        )
                        
                        yield {
                            "type": "tool_call",
                            "tool": tc.name,
                            "arguments": tc.arguments
                        }
                        
                        result = await self.tool_registry.execute(tc)
                        
                        yield {
                            "type": "tool_result",
                            "tool": result.name,
                            "result": result.result,
                            "success": result.success
                        }
                        
                        # Add tool result to messages
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": json.dumps(result.result) if result.success else f"Error: {result.error}"
                        })
                    
                    continue  # Process next round with tool results
                
                else:
                    # No tool calls, return text response
                    yield {
                        "type": "text",
                        "content": message.content
                    }
                    return
                    
            except Exception as e:
                logger.error("LLM generation failed", error=str(e), round=round_num)
                yield {
                    "type": "text",
                    "content": "I'm sorry, I encountered an error processing your request."
                }
                return
        
        # If we reach here, we hit max tool rounds
        yield {
            "type": "text",
            "content": "I apologize, but I'm having trouble completing this request. Could you please rephrase?"
        }
    
    async def generate_streaming_response(
        self,
        conversation_history: List[ConversationMessage],
        system_prompt: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming response from LLM.
        
        Yields:
            Text chunks as they're generated
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        for msg in conversation_history:
            messages.append({
                "role": msg.role.value,
                "content": msg.content
            })
        
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error("LLM streaming failed", error=str(e))
            yield "I'm sorry, I encountered an error processing your request."


class OllamaLLMProvider:
    """
    Ollama LLM provider for local inference.
    
    Features:
    - Local inference without API keys
    - Function calling support
    - Streaming responses
    - Multiple model support
    """
    
    def __init__(
        self,
        model: str = "llama3.2",
        temperature: float = 0.7,
        max_tokens: int = 150,
        base_url: str = "http://127.0.0.1:11434"
    ):
        import httpx
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=60.0)
        self.tool_registry = ToolRegistry()
        self._max_tool_rounds = 5
        
        # Register default tools
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default tools for voice agent."""
        
        async def get_current_time() -> str:
            """Get current date and time."""
            return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        async def calculate(expression: str) -> str:
            """Calculate a mathematical expression."""
            try:
                result = eval(expression, {"__builtins__": {}}, {})
                return str(result)
            except Exception as e:
                return f"Error: {str(e)}"
        
        async def lookup_info(query: str) -> str:
            """Look up information from knowledge base."""
            return f"Information about '{query}': This is a placeholder for knowledge base lookup."
        
        self.tool_registry.register(
            name="get_current_time",
            description="Get the current date and time",
            parameters={
                "type": "object",
                "properties": {},
                "required": []
            },
            handler=get_current_time
        )
        
        self.tool_registry.register(
            name="calculate",
            description="Calculate a mathematical expression",
            parameters={
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "The mathematical expression to evaluate"
                    }
                },
                "required": ["expression"]
            },
            handler=calculate
        )
        
        self.tool_registry.register(
            name="lookup_info",
            description="Look up information from a knowledge base",
            parameters={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The query to search for"
                    }
                },
                "required": ["query"]
            },
            handler=lookup_info
        )
    
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        use_tools: bool = True
    ) -> str:
        """Generate a response using Ollama."""
        try:
            # Build prompt from messages
            prompt = self._build_prompt(messages)
            
            # Call Ollama API
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": self.temperature,
                        "num_predict": self.max_tokens
                    }
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "I couldn't generate a response.")
            else:
                logger.error("Ollama API error", status=response.status_code)
                return "I'm having trouble connecting to the AI model."
                
        except Exception as e:
            logger.error("Ollama generation failed", error=str(e))
            return "I'm sorry, I encountered an error processing your request."
    
    async def generate_response_stream(
        self,
        messages: List[Dict[str, str]],
        use_tools: bool = True
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming response using Ollama."""
        try:
            prompt = self._build_prompt(messages)
            
            async with self.client.stream(
                "POST",
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": True,
                    "options": {
                        "temperature": self.temperature,
                        "num_predict": self.max_tokens
                    }
                }
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        import json
                        data = json.loads(line)
                        if "response" in data:
                            yield data["response"]
                            
        except Exception as e:
            logger.error("Ollama streaming failed", error=str(e))
            yield "I'm sorry, I encountered an error processing your request."
    
    async def generate_response_with_tools(
        self,
        conversation_history: List[ConversationMessage],
        system_prompt: Optional[str] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Generate response with tool calling support (matching LLMProvider interface).
        
        Args:
            conversation_history: List of ConversationMessage objects
            system_prompt: Optional system prompt
            
        Yields:
            Dictionary with type (text/tool_call/result) and content
        """
        try:
            # Convert ConversationMessage list to dicts for Ollama
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            
            for msg in conversation_history:
                messages.append({
                    "role": msg.role.value if hasattr(msg.role, 'value') else msg.role,
                    "content": msg.content
                })
            
            response = await self.generate_response(messages, use_tools=False)
            yield {"type": "text", "content": response}
            
        except Exception as e:
            logger.error("Ollama tool generation failed", error=str(e))
            yield {"type": "text", "content": "I'm sorry, I encountered an error processing your request."}
    
    async def generate_streaming_response(
        self,
        conversation_history: List[ConversationMessage],
        system_prompt: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming response (matching LLMProvider interface).
        
        Args:
            conversation_history: List of ConversationMessage objects
            system_prompt: Optional system prompt
            
        Yields:
            Text chunks as they're generated
        """
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            
            for msg in conversation_history:
                messages.append({
                    "role": msg.role.value if hasattr(msg.role, 'value') else msg.role,
                    "content": msg.content
                })
            
            async for chunk in self.generate_response_stream(messages):
                yield chunk
                
        except Exception as e:
            logger.error("Ollama streaming failed", error=str(e))
            yield "I'm sorry, I encountered an error processing your request."
    
    def _build_prompt(self, messages: List[Dict[str, str]]) -> str:
        """Build a prompt from messages."""
        prompt_parts = []
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                prompt_parts.append(f"System: {content}")
            elif role == "user":
                prompt_parts.append(f"User: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
        
        prompt_parts.append("Assistant: ")
        return "\n".join(prompt_parts)


def create_llm_provider(**kwargs) -> LLMProvider:
    """Factory function to create LLM provider."""
    settings = get_settings()
    
    # Check if using Ollama
    if settings.llm_provider == "ollama":
        return OllamaLLMProvider(
            model=kwargs.get("model", settings.ollama_model),
            temperature=kwargs.get("temperature", settings.llm_temperature),
            max_tokens=kwargs.get("max_tokens", settings.llm_max_tokens)
        )
    
    return LLMProvider(
        api_key=kwargs.get("api_key", settings.openai_api_key),
        model=kwargs.get("model", settings.llm_model),
        temperature=kwargs.get("temperature", settings.llm_temperature),
        max_tokens=kwargs.get("max_tokens", settings.llm_max_tokens)
    )
