import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, Lock, Server, FileText, CheckCircle2,
  Globe2, Cpu, Key, AlertCircle, Download, ExternalLink,
  ChevronRight, RefreshCw, Zap
} from 'lucide-react'

const securityPillars = [
  {
    icon: ShieldCheck,
    title: 'SOC 2 Type II & ISO 27001',
    category: 'Independent Audits',
    badge: 'Certified',
    desc: 'Independently audited annually across Security, Availability, and Confidentiality trust service criteria. Continuous automated control monitoring.',
    details: ['Annual third-party SOC 2 Type II audit report', 'ISO/IEC 27001:2022 certified ISMS', 'Continuous pen-testing by CREST-accredited labs', 'Automated vulnerability scanning with zero critical backlog']
  },
  {
    icon: Lock,
    title: 'Zero Data Retention (ZDR)',
    category: 'Privacy by Design',
    badge: 'Guaranteed',
    desc: 'Ephemeral audio streaming architecture. Customer voice audio is translated in-memory and never cached, written to disk, or used to train models.',
    details: ['RAM-only in-flight processing', 'Strict contract-bound non-training guarantee', 'Immediate cryptographic disposal upon call termination', 'Custom retention policies available for compliance-regulated firms']
  },
  {
    icon: Globe2,
    title: 'Data Sovereignty & Residency',
    category: 'Global Regulatory',
    badge: 'Multi-Region',
    desc: 'Local-first processing tailored for India DPDP Act 2023, EU GDPR, and US HIPAA. Data never leaves your designated jurisdictional boundary.',
    details: ['India-first edge cluster in Mumbai & Pune (MeitY compliant)', 'EU Frankfurt & Dublin data residency for GDPR', 'US East & West VPC options for HIPAA compliance', 'Dedicated on-premise & private VPC container deployments']
  },
  {
    icon: Key,
    title: 'Military-Grade Encryption',
    category: 'Cryptographic Controls',
    badge: 'TLS 1.3 / AES-256',
    desc: 'End-to-end cryptographic protection for voice, video, text, and metadata across every hop and network boundary.',
    details: ['TLS 1.3 with Perfect Forward Secrecy (PFS) in transit', 'AES-256-GCM encryption for all secrets at rest', 'Hardware Security Module (HSM) key management', 'Client-controlled KMS encryption key rotation (BYOK)']
  },
  {
    icon: Zap,
    title: 'DDoS & Traffic Protection',
    category: 'Infrastructure',
    badge: '99.99% SLA',
    desc: 'Multi-layered edge DDoS mitigation, token bucket rate limiting, and real-time socket throttling handling millions of concurrent calls.',
    details: ['Edge rate-limiting zones with burst protection', 'Automated IP throttling and slowloris mitigation', 'Multi-zone active-active redundant failover', 'Financial-grade 99.99% uptime SLA with 24/7 dedicated SRE support']
  },
  {
    icon: Cpu,
    title: 'Enterprise Governance & SSO',
    category: 'Access Management',
    badge: 'SAML 2.0 / Okta',
    desc: 'Integrate seamlessly with your corporate identity provider. Centralized user management, SCIM provisioning, and immutable audit logs.',
    details: ['SAML 2.0 & OIDC support (Okta, Azure AD, Ping, Google Workspace)', 'Granular Role-Based Access Control (RBAC)', 'Immutable audit trail logs with unique X-Request-ID tracking', 'SIEM integration support (Splunk, Datadog, Sumo Logic)']
  }
]

const complianceCertifications = [
  { name: 'SOC 2 Type II', authority: 'AICPA Standard', status: 'Verified' },
  { name: 'ISO/IEC 27001', authority: 'BSI International', status: 'Certified' },
  { name: 'GDPR Compliant', authority: 'European Union', status: 'Compliant' },
  { name: 'DPDP Act 2023', authority: 'Govt of India', status: 'Compliant' },
  { name: 'HIPAA Ready', authority: 'US Healthcare', status: 'BAA Available' },
  { name: 'PCI-DSS Level 1', authority: 'Payment Gateway', status: 'Compliant' },
]

export default function EnterpriseSecurity() {
  const [selectedPillar, setSelectedPillar] = useState(0)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownloadReport = () => {
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 4000)
  }

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background radial washes */}
      <div className="absolute inset-0 bg-[#08080D]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#6C3CE1]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#00D4AA]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-medium tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Tier-1 MNC & Banking Grade Security
          </div>
          <h2 className="text-[2.5rem] sm:text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] mb-6">
            Security, Privacy & Compliance{' '}
            <span className="gradient-text">Without Compromise.</span>
          </h2>
          <p className="text-[16px] sm:text-[18px] text-gray-400 leading-relaxed">
            ClearSpeak is engineered from the ground up to satisfy the rigorous security and data residency standards of Fortune 500 corporations, government entities, and global healthcare providers.
          </p>
        </div>

        {/* Live SLA & Trust Banner */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-16 backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight">99.99%</div>
              <div className="text-[12px] text-gray-400 uppercase tracking-wider mt-1">Uptime SLA Guarantee</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[32px] font-bold text-emerald-400 tracking-tight">0 ms</div>
              <div className="text-[12px] text-gray-400 uppercase tracking-wider mt-1">Audio Retention Window</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[32px] font-bold text-[#9B6DFF] tracking-tight">AES-256</div>
              <div className="text-[12px] text-gray-400 uppercase tracking-wider mt-1">End-to-End Encryption</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[32px] font-bold text-[#FF6B35] tracking-tight">100%</div>
              <div className="text-[12px] text-gray-400 uppercase tracking-wider mt-1">Data Sovereignty Ready</div>
            </div>
          </div>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {securityPillars.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedPillar(i)}
                className={`p-7 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  selectedPillar === i
                    ? 'bg-white/[0.06] border-[#6C3CE1] shadow-[0_8px_30px_rgba(108,60,225,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3CE1]/30 to-[#9B6DFF]/20 flex items-center justify-center text-[#9B6DFF]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.06] border border-white/[0.08] text-gray-300">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-[#9B6DFF] uppercase tracking-wider mb-1.5">{p.category}</div>
                <h3 className="text-[18px] font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed mb-5">{p.desc}</p>

                <ul className="space-y-2 border-t border-white/[0.06] pt-4">
                  {p.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-[12px] text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Global Certifications & MNC Trust Strip */}
        <div className="bg-gradient-to-r from-white/[0.03] via-white/[0.05] to-white/[0.03] border border-white/[0.08] rounded-3xl p-8 sm:p-10 mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-[11px] font-semibold text-[#FF6B35] uppercase tracking-wider block mb-2">Compliance Directory</span>
              <h3 className="text-2xl font-bold text-white mb-2">Audited Certifications & Attestations</h3>
              <p className="text-sm text-gray-400 max-w-xl">
                We provide complete compliance documentation, DPA execution, and third-party penetration test summaries under mutual NDA.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3.5 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] text-white rounded-xl text-sm font-semibold hover:shadow-[0_12px_30px_rgba(108,60,225,0.4)] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {downloadSuccess ? 'Package Queued!' : 'Download Security Whitepaper'}
              </button>
              <a
                href="mailto:security@clearspeak.ai"
                className="px-6 py-3.5 bg-white/[0.04] border border-white/[0.1] text-white rounded-xl text-sm font-semibold hover:bg-white/[0.08] transition-colors flex items-center gap-2"
              >
                Request SOC 2 Report <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 pt-8 border-t border-white/[0.08]">
            {complianceCertifications.map((c) => (
              <div key={c.name} className="p-4 rounded-xl bg-black/30 border border-white/[0.04] text-center">
                <div className="text-[13px] font-semibold text-white truncate">{c.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{c.authority}</div>
                <div className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {c.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated MNC Deployment Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-lg font-semibold text-white mb-2">1. Multi-Tenant Enterprise Cloud</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Fully managed, highly available cluster deployed across global edge regions with dedicated rate limits and guaranteed 99.99% SLA.
            </p>
            <span className="text-[11px] text-[#9B6DFF] font-medium">Immediate Activation • Zero Infrastructure Overhead</span>
          </div>

          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-lg font-semibold text-white mb-2">2. Dedicated Private VPC</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Isolated single-tenant environment deployed in your AWS, GCP, or Azure account with custom KMS encryption keys and private endpoints.
            </p>
            <span className="text-[11px] text-[#00D4AA] font-medium">100% Network Isolation • Direct VPC Peering</span>
          </div>

          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-lg font-semibold text-white mb-2">3. Sovereign Air-Gapped On-Prem</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Packaged containerized distribution for banking, defense, and high-security enterprises requiring 100% offline, zero-internet speech pipelines.
            </p>
            <span className="text-[11px] text-[#FF6B35] font-medium">Air-Gapped Ready • Sovereign Hardware Support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
