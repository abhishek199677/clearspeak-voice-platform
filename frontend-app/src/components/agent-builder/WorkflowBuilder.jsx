import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Zap, Users, MessageSquare, Brain, Shield, Calendar, TrendingUp, Settings, ChevronDown, Plus, X, Mail } from 'lucide-react'

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('Customer Support Agent')
  const [isActive, setIsActive] = useState(true)
  const [trigger, setTrigger] = useState('Message Received')
  const [actions, setActions] = useState([
    { id: 1, name: 'Analyze Sentiment', type: 'AI Analysis', config: { model: 'sentiment-analysis' } },
    { id: 2, name: 'Route to Team', type: 'Action', config: { team: 'support' } },
    { id: 3, name: 'Send Response', type: 'Message', config: { template: 'Hello! How can I help you today?' } },
  ])
  const [availableTriggers, setAvailableTriggers] = useState([
    'Message Received',
    'New User Joins',
    'Specific Keyword Mentioned',
    'Time-based Schedule',
    'API Webhook',
    'File Uploaded',
  ])
  const [availableActions, setAvailableActions] = useState([
    { name: 'Send Message', type: 'Message', icon: MessageSquare },
    { name: 'Analyze Sentiment', type: 'AI Analysis', icon: Brain },
    { name: 'Route to Team', type: 'Action', icon: Users },
    { name: 'Create Ticket', type: 'Integration', icon: Shield },
    { name: 'Schedule Follow-up', type: 'Action', icon: Calendar },
    { name: 'Update CRM', type: 'Integration', icon: TrendingUp },
    { name: 'Send Email', type: 'Message', icon: Mail },
    { name: 'Analyze Intent', type: 'AI Analysis', icon: Zap },
  ])

  const handleAddAction = (action) => {
    const newAction = {
      id: Date.now(),
      name: action.name,
      type: action.type,
      config: {},
    }
    setActions([...actions, newAction])
  }

  const handleRemoveAction = (id) => {
    setActions(actions.filter(action => action.id !== id))
  }

  const handleUpdateAction = (id, updates) => {
    setActions(actions.map(action =>
      action.id === id ? { ...action, ...updates } : action
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="space-y-6 overflow-x-hidden"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">AI Agent Workflow Builder</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Badge
                  variant={isActive ? 'success' : 'destructive'}
                  className="text-xs"
                >
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="workflow-trigger">Trigger Event</Label>
              <DropdownMenu className="w-full">
                <DropdownMenuTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-muted/50 bg-background hover:bg-muted/100">
                  <span className="text-sm font-medium text-muted-foreground">{trigger}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] p-0">
                  {availableTriggers.map((t) => (
                    <DropdownMenuItem
                      key={t}
                      onClick={() => setTrigger(t)}
                      className="px-4 py-2 text-sm w-full left-0"
                    >
                      {t}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-3">
              <Label htmlFor="workflow-description">Description (Optional)</Label>
              <Textarea
                id="workflow-description"
                placeholder="Describe what this workflow does..."
                className="w-full min-h-[80px]"
              />
            </div>
            <Divider className="my-4" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Workflow Steps</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // In a real implementation, this would open a modal to add actions
                  alert('Action builder modal would open here')
                }}
              >
                <Plus className="w-3 h-3 mr-2" />
                Add Action
              </Button>
            </div>
            <div className="h-[200px] border border-muted/20 rounded-lg overflow-y-auto">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-3 p-3 border-b border-muted/50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                    {action.type === 'Message' && <MessageSquare className="w-4 h-4 text-primary" />}
                    {action.type === 'AI Analysis' && <Zap className="w-4 h-4 text-accent" />}
                    {action.type === 'Action' && <Users className="w-4 h-4 text-success" />}
                    {action.type === 'Integration' && <Shield className="w-4 h-4 text-warning" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{action.name}</p>
                    <p className="text-xs text-muted-foreground">{action.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveAction(action.id)}
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {actions.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-muted-foreground">No actions added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="grid gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Available Triggers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableTriggers.map((trigger) => (
              <div key={trigger} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{trigger}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableActions.map((action) => (
              <div key={action.name} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  {action.icon && <action.icon className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{action.name}</p>
                  <p className="text-xs text-muted-foreground">{action.type}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAction(action)}
                  className="mt-2"
                >
                  Add to Workflow
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// Helper components
function Label({ htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm font-medium text-muted-foreground"
      {...props}
    >
      {props.children}
    </label>
  )
}

function Divider({ className, ...props }) {
  return (
    <div
      className="h-px w-full bg-muted/50 {className}"
      {...props}
    />
  )
}