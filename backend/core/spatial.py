"""Spatial Awareness Manager for accessibility features."""

import asyncio
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
import structlog

logger = structlog.get_logger()


class AccessibilityFeature:
    """Accessibility feature types."""
    AUDIO_DESCRIPTION = "audio_description"
    GESTURE_RECOGNITION = "gesture_recognition"
    SCREEN_READER = "screen_reader"
    VOICE_COMMANDS = "voice_commands"
    HIGH_CONTRAST = "high_contrast"
    MAGNIFICATION = "magnification"
    KEYBOARD_NAVIGATION = "keyboard_navigation"
    CLOSED_CAPTIONS = "closed_captions"


class SpatialObject:
    """Represents a spatial object in the environment."""
    
    def __init__(
        self,
        object_id: str,
        name: str,
        object_type: str,
        position: Dict[str, float],
        description: Optional[str] = None
    ):
        self.object_id = object_id
        self.name = name
        self.object_type = object_type
        self.position = position  # {x, y, z}
        self.description = description
        self.created_at = datetime.utcnow()
        self.last_updated = datetime.utcnow()
        self.is_visible: bool = True
        self.audio_feedback: Optional[str] = None
        
    def to_dict(self) -> dict:
        return {
            "object_id": self.object_id,
            "name": self.name,
            "object_type": self.object_type,
            "position": self.position,
            "description": self.description,
            "is_visible": self.is_visible,
            "audio_feedback": self.audio_feedback,
            "created_at": self.created_at.isoformat(),
            "last_updated": self.last_updated.isoformat()
        }


class SpatialAwarenessManager:
    """
    Manages spatial awareness features for visually impaired users.
    
    Features:
    - Audio descriptions of visual elements
    - Gesture recognition and conversion
    - Screen reader compatibility
    - Voice commands for navigation
    - High contrast and magnification modes
    - Keyboard navigation shortcuts
    """
    
    def __init__(self):
        self._objects: Dict[str, SpatialObject] = {}
        self._user_settings: Dict[str, dict] = {}
        self._gesture_commands: Dict[str, str] = {
            "swipe_up": "scroll_up",
            "swipe_down": "scroll_down",
            "swipe_left": "go_back",
            "swipe_right": "go_forward",
            "tap": "select",
            "double_tap": "activate",
            "long_press": "context_menu",
            "pinch_in": "zoom_out",
            "pinch_out": "zoom_in",
        }
        self._voice_commands: Dict[str, str] = {
            "go to top": "scroll_to_top",
            "go to bottom": "scroll_to_bottom",
            "go back": "navigate_back",
            "go forward": "navigate_forward",
            "select": "click_current",
            "activate": "double_click_current",
            "next": "focus_next",
            "previous": "focus_previous",
            "read": "read_current_element",
            "stop": "stop_audio",
            "help": "show_help",
        }
        self._audio_descriptions: Dict[str, str] = {}
        
    async def register_object(
        self,
        name: str,
        object_type: str,
        position: Dict[str, float],
        description: Optional[str] = None,
        audio_feedback: Optional[str] = None
    ) -> SpatialObject:
        """Register a spatial object."""
        object_id = f"obj-{uuid.uuid4().hex[:8]}"
        obj = SpatialObject(object_id, name, object_type, position, description)
        obj.audio_feedback = audio_feedback
        
        self._objects[object_id] = obj
        logger.info("Spatial object registered", object_id=object_id, name=name)
        return obj
    
    async def update_object_position(
        self,
        object_id: str,
        position: Dict[str, float]
    ) -> bool:
        """Update position of a spatial object."""
        obj = self._objects.get(object_id)
        if not obj:
            return False
        
        obj.position = position
        obj.last_updated = datetime.utcnow()
        return True
    
    async def set_audio_description(
        self,
        element_id: str,
        description: str
    ) -> bool:
        """Set audio description for a visual element."""
        self._audio_descriptions[element_id] = description
        return True
    
    async def get_audio_description(self, element_id: str) -> Optional[str]:
        """Get audio description for a visual element."""
        return self._audio_descriptions.get(element_id)
    
    async def process_gesture(
        self,
        user_id: str,
        gesture: str
    ) -> Optional[str]:
        """Process a gesture and return the corresponding action."""
        action = self._gesture_commands.get(gesture)
        if action:
            logger.info("Gesture processed", user_id=user_id, gesture=gesture, action=action)
            return action
        return None
    
    async def process_voice_command(
        self,
        user_id: str,
        command: str
    ) -> Optional[str]:
        """Process a voice command and return the corresponding action."""
        command_lower = command.lower().strip()
        action = self._voice_commands.get(command_lower)
        if action:
            logger.info("Voice command processed", user_id=user_id, command=command, action=action)
            return action
        return None
    
    async def get_nearby_objects(
        self,
        position: Dict[str, float],
        radius: float = 10.0
    ) -> List[SpatialObject]:
        """Get objects within a radius of a position."""
        nearby = []
        
        for obj in self._objects.values():
            if not obj.is_visible:
                continue
            
            # Calculate distance
            dx = obj.position.get("x", 0) - position.get("x", 0)
            dy = obj.position.get("y", 0) - position.get("y", 0)
            dz = obj.position.get("z", 0) - position.get("z", 0)
            distance = (dx**2 + dy**2 + dz**2) ** 0.5
            
            if distance <= radius:
                nearby.append(obj)
        
        # Sort by distance
        nearby.sort(key=lambda o: (
            (o.position.get("x", 0) - position.get("x", 0))**2 +
            (o.position.get("y", 0) - position.get("y", 0))**2 +
            (o.position.get("z", 0) - position.get("z", 0))**2
        ) ** 0.5)
        
        return nearby
    
    async def set_user_settings(
        self,
        user_id: str,
        settings: dict
    ) -> bool:
        """Set accessibility settings for a user."""
        self._user_settings[user_id] = {
            "high_contrast": settings.get("high_contrast", False),
            "magnification": settings.get("magnification", 1.0),
            "screen_reader": settings.get("screen_reader", False),
            "voice_commands": settings.get("voice_commands", False),
            "keyboard_navigation": settings.get("keyboard_navigation", False),
            "closed_captions": settings.get("closed_captions", True),
            "audio_descriptions": settings.get("audio_descriptions", True),
            "gesture_control": settings.get("gesture_control", False),
        }
        logger.info("User settings updated", user_id=user_id)
        return True
    
    async def get_user_settings(self, user_id: str) -> dict:
        """Get accessibility settings for a user."""
        return self._user_settings.get(user_id, {
            "high_contrast": False,
            "magnification": 1.0,
            "screen_reader": False,
            "voice_commands": False,
            "keyboard_navigation": False,
            "closed_captions": True,
            "audio_descriptions": True,
            "gesture_control": False,
        })
    
    async def get_keyboard_shortcuts(self) -> Dict[str, str]:
        """Get keyboard shortcuts for navigation."""
        return {
            "Tab": "Move to next element",
            "Shift+Tab": "Move to previous element",
            "Enter": "Activate current element",
            "Space": "Toggle current element",
            "Arrow Up": "Scroll up or move up",
            "Arrow Down": "Scroll down or move down",
            "Arrow Left": "Move left or go back",
            "Arrow Right": "Move right or go forward",
            "Home": "Go to beginning",
            "End": "Go to end",
            "Page Up": "Scroll up one page",
            "Page Down": "Scroll down one page",
            "Escape": "Cancel or close",
            "F1": "Show help",
            "Ctrl+Home": "Go to top of page",
            "Ctrl+End": "Go to bottom of page",
        }
    
    async def generate_audio_feedback(
        self,
        element_type: str,
        element_name: str,
        action: Optional[str] = None
    ) -> str:
        """Generate audio feedback for an element."""
        feedback = f"{element_type}: {element_name}"
        if action:
            feedback += f". {action}"
        return feedback
    
    async def get_spatial_description(
        self,
        user_position: Dict[str, float],
        facing_direction: str = "forward"
    ) -> str:
        """Get a spatial description of the environment."""
        nearby_objects = await self.get_nearby_objects(user_position, radius=5.0)
        
        if not nearby_objects:
            return "No objects detected nearby."
        
        descriptions = []
        for obj in nearby_objects[:5]:  # Limit to 5 objects
            # Calculate relative position
            dx = obj.position.get("x", 0) - user_position.get("x", 0)
            dy = obj.position.get("y", 0) - user_position.get("y", 0)
            
            # Determine direction
            if abs(dx) > abs(dy):
                direction = "right" if dx > 0 else "left"
            else:
                direction = "front" if dy > 0 else "behind"
            
            descriptions.append(f"{obj.name} to your {direction}")
        
        return f"Nearby objects: {', '.join(descriptions)}"
    
    async def delete_object(self, object_id: str) -> bool:
        """Delete a spatial object."""
        if object_id in self._objects:
            del self._objects[object_id]
            logger.info("Spatial object deleted", object_id=object_id)
            return True
        return False
    
    async def list_objects(self) -> List[SpatialObject]:
        """List all spatial objects."""
        return list(self._objects.values())
