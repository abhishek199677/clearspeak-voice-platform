import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Stat, StatLabel, StatValue } from '@/components/ui/stat'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, MessageSquare, Phone, Zap, Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    activeSessions: 1247,
    totalMessages: 89245,
    translationAccuracy: 98.7,
    apiCalls: 342189,
  })
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Simulate fetching chart data
    const data = Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 50,
    }))
    setChartData(data)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="space-y-6 overflow-x-hidden"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <Stat>
          <StatLabel>Active Sessions</StatLabel>
          <StatValue>{stats.activeSessions.toLocaleString()}</StatValue>
          <Badge variant="secondary" className="mt-2">
            +12% vs last week
          </Badge>
        </Stat>
        <Stat>
          <StatLabel>Messages Processed</StatLabel>
          <StatValue>{stats.totalMessages.toLocaleString()}</StatValue>
          <Badge variant="success" className="mt-2">
            +8% vs last week
          </Badge>
        </Stat>
        <Stat>
          <StatLabel>Translation Accuracy</StatLabel>
          <StatValue>{stats.translationAccuracy}%</StatValue>
          <Badge variant="default" className="mt-2">
            +0.3% vs last week
          </Badge>
        </Stat>
        <Stat>
          <StatLabel>API Calls</StatLabel>
          <StatValue>{stats.apiCalls.toLocaleString()}</StatValue>
          <Badge variant="accent" className="mt-2">
            +15% vs last week
          </Badge>
        </Stat>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="grid gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-success" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">API Response Time</p>
                  <p className="text-xs text-muted-foreground">124ms avg</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Uptime</p>
                  <p className="text-xs text-muted-foreground">99.98%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Concurrent Users</p>
                  <p className="text-xs text-muted-foreground">2.4K peak</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Messages/sec</p>
                  <p className="text-xs text-muted-foreground">4.2K</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-96 w-full">
              {/* Simulated chart - in real implementation, use a charting library */}
              <div className="relative h-full w-full bg-muted/50 rounded-lg">
                {chartData.map((point, index) => (
                  <div
                    key={index}
                    className={`absolute bottom-0 left-[${index * 3.33}%] w-[3.33%] bg-primary/50 h-[${point.value}%] rounded-t-lg transition-all duration-500`}
                  />
                ))}
                <div className="absolute bottom-0 left-0 w-full h-px bg-muted/20" />
                <div className="absolute bottom-0 left-0 flex w-full space-x-[3.33%] pointer-events-none">
                  {chartData.map((_, index) => (
                    <div key={index} className="w-[3.33%] flex-1 text-xs text-muted-foreground">
                      {index % 5 === 0 && `${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Last 30 Days</span>
              <span>Messages: 89K</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">New AI Agent Deployed</p>
                  <p className="text-xs text-muted-foreground">Customer Support Bot • 2 min ago</p>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Translation API Updated</p>
                  <p className="text-xs text-muted-foreground">Added 3 new languages • 15 min ago</p>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Peak Usage Alert</p>
                  <p className="text-xs text-muted-foreground">95% capacity reached • 1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">High Memory Usage</p>
                  <p className="text-xs text-muted-foreground">Node 3: 87% utilization</p>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-warning" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-warning">API Rate Limit Approaching</p>
                  <p className="text-xs text-muted-foreground">90% of quota used</p>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-success">All Systems Operational</p>
                  <p className="text-xs text-muted-foreground">Last checked: Just now</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}