import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Reactor Safety Integration & Deployment');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-6 md:p-8" id="contact-montu-form-panel">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-emerald-400 tracking-wider uppercase block mb-1">Sans Mercantile Constellation Node</span>
          <h3 className="text-2xl font-serif text-slate-100 tracking-tight">Connect with MONTU Intelligence</h3>
          <p className="text-xs text-slate-400 mt-2">
            Establish communication with MONTU safety engineering desks for deployment of AI-guided reactor control and cyber physical safeguard frameworks.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-6 text-center text-slate-200">
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
            <h4 className="font-sans font-medium text-slate-100 text-base">Transmission Locked & Encrypted</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
              We have acknowledged your nuclear integration packet on of secure channel. MONTU safeguarding engineers will establish routing back to your workspace.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-xs font-mono text-emerald-400 hover:underline"
            >
              Dispatch New Package
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase font-mono text-slate-400 block mb-1.5">Sector Routing Address (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mezzoforte@sansmercantile.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 text-slate-100 rounded-lg py-2.5 px-3.5 text-sm font-sans placeholder-slate-700 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-mono text-slate-400 block mb-1.5">Operational Core Class</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 text-slate-100 rounded-lg py-2.5 px-3.5 text-sm font-sans outline-none transition-colors"
              >
                <option>Reactor Safety Integration & Deployment</option>
                <option>SOBEK Cyber Protection Implementation</option>
                <option>KIBUKA Aerial Drone/Satellite Tracking License</option>
                <option>RA Hybrid Grid Load Balancing Systems</option>
                <option>General Constellation Inbound Inquiry</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-mono text-slate-400 block mb-1.5">Integration Project Specs</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe current reactor model, grid thermal load configurations, or surveillance constraints query..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 text-slate-100 rounded-lg lg:py-2.5 lg:px-3.5 text-sm font-sans placeholder-slate-700 outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 font-sans py-3 px-4 rounded-lg text-xs font-bold text-slate-900 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Encoding Payload..." : "Transmit Encrypted Package"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
