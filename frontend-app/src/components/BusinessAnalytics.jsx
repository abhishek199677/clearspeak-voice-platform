import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  TrendingUp, Users, Zap, Globe, Activity, CheckCircle,
  MessageSquare, Phone, Shield, Banknote
} from 'lucide-react'

export default function BusinessAnalytics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Mock business analytics data (in a real app, this would come from API)
  const stats = [
    {
      icon: TrendingUp,
      label: 'User Growth',
      value: '142%',
      sublabel: 'MoM increase',
      color: 'from-[#00D4AA] to-[#00F5C4]'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '284K+',
      sublabel: 'Monthly active',
      color: 'from-[#6C3CE1] to-[#9B6DFF]'
    },
    {
      icon: Zap,
      label: 'Translation Volume',
      value: '4.2M+',
      sublabel: 'Daily translations',
      color: 'from-[#FF6B35] to-[#FF8F6B]'
    },
    {
      icon: Globe,
      label: 'Global Reach',
      value: '189',
      sublabel: 'Countries served',
      color: 'from-[#E040FB] to-[#F060FF]'
    }
  ]

  const metrics = [
    {
      label: 'API Response Time',
      value: '142ms',
      target: '<200ms',
      status: 'good'
    },
    {
      label: 'Translation Accuracy',
      value: '98.7%',
      target: '>98%',
      status: 'good'
    },
    {
      label: 'System Uptime',
      value: '99.95%',
      target: '>99.9%',
      status: 'good'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.8/5',
      target: '>4.5',
      status: 'good'
    }
  ]

  return (
    <section id="business-analytics" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">Business Intelligence</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Powerful Analytics for{' '}
            <span className="gradient-text">Data-Driven Decisions</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Gain actionable insights into user engagement, translation performance, and ROI with our comprehensive business analytics dashboard.
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[24px] font-bold text-white">{stat.value}</p>
                  <p className="text-[13px] text-gray-500">{stat.label}</p>
                  <p className="text-[11px] text-gray-400">{stat.sublabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8"
        >
          <h3 className="text-lg font-semibold mb-6 text-white">Performance Metrics</h3>
          <div className="space-y-4">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl"
              >
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-white">{metric.label}</p>
                  <p className="text-[12px] text-gray-400">Target: {metric.target}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-[20px] font-bold text-white ${metric.status === 'good' ? 'text-[#00D4AA]' : 'text-[#FF6B35]'}`}>
                    {metric.value}
                  </p>
                  <div className={`w-2 h-2 rounded-full ${metric.status === 'good' ? 'bg-[#00D4AA]/20' : 'bg-[#FF6B35]/20'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Usage Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8"
        >
          <h3 className="text-lg font-semibold mb-6 text-white">Usage Trends (Last 30 Days)</h3>
          <div className="h-48 w-full relative">
            {/* Simulated chart using divs - in production, use a charting library */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6C3CE1]/10 to-[#FF6B35]/5 rounded-xl" />
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#6C3CE1] to-[#FF6B35]" />
            {/* Chart bars */}
            <div className="absolute bottom-2 left-4 h-36 w-[calc(100%-8px)] flex items-end justify-between space-x-1">
              {[12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 52, 48, 55, 60, 58, 65, 70, 68, 75, 80, 78, 85, 90, 88, 95, 100, 92, 105].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex-1 bg-gradient-to-r from-[#6C3CE1] to-[#FF6B35] rounded-t-lg relative`}
                >
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-white/[0.2]" />
                </motion.div>
              ))}</div>
          </div>
          <div className="mt-4 flex justify-between text-[11px] text-gray-500">
            <span>Translation Requests</span>
            <span>105K (Peak)</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}