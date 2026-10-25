import React, { useState } from 'react';
import { X, Ruler, Save, Copy, Check } from 'lucide-react';
import { ClientMeasurements } from '../types';

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (measurements: ClientMeasurements, clientName: string) => void;
}

export const MeasurementModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [clientName, setClientName] = useState('');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState<ClientMeasurements>({
    neck: 16.5,
    chestBust: 42,
    waist: 34,
    hips: 43,
    shoulderWidth: 18.5,
    sleeveLength: 25.5,
    fullLength: 44,
    inseam: 31.5,
    agbadaSpan: 64,
    unit: 'inches',
    notes: 'Square shoulder posture; add 1" ease for chest drape.'
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof ClientMeasurements, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUnitToggle = (newUnit: 'inches' | 'cm') => {
    if (newUnit === unit) return;
    const factor = newUnit === 'cm' ? 2.54 : 1 / 2.54;
    setForm(prev => ({
      ...prev,
      neck: prev.neck ? Number((prev.neck * factor).toFixed(1)) : undefined,
      chestBust: Number((prev.chestBust * factor).toFixed(1)),
      waist: Number((prev.waist * factor).toFixed(1)),
      hips: Number((prev.hips * factor).toFixed(1)),
      shoulderWidth: Number((prev.shoulderWidth * factor).toFixed(1)),
      sleeveLength: Number((prev.sleeveLength * factor).toFixed(1)),
      fullLength: Number((prev.fullLength * factor).toFixed(1)),
      inseam: prev.inseam ? Number((prev.inseam * factor).toFixed(1)) : undefined,
      agbadaSpan: prev.agbadaSpan ? Number((prev.agbadaSpan * factor).toFixed(1)) : undefined,
      unit: newUnit
    }));
    setUnit(newUnit);
  };

  const copyToClipboard = () => {
    const text = `Tailor Measurement Card — ${clientName || 'Client'} (${unit})
Neck: ${form.neck || '-'}
Chest/Bust: ${form.chestBust}
Waist: ${form.waist}
Hips: ${form.hips}
Shoulder Width: ${form.shoulderWidth}
Sleeve Length: ${form.sleeveLength}
Full Garment Length: ${form.fullLength}
Trouser Inseam: ${form.inseam || '-'}
Agbada Wing Span: ${form.agbadaSpan || '-'}
Notes: ${form.notes || '-'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(form, clientName || 'Client');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-editorial">Digital Client Tape Card</h3>
              <p className="text-[11px] text-zinc-400">Standard bespoke landmarks for cutters & seamstresses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Client name and units */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-zinc-400 block mb-1 font-medium">Client Full Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Chief Adeleke"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1 font-medium">Measurement Unit</label>
              <div className="flex items-center p-0.5 bg-zinc-950 border border-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('inches')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
                    unit === 'inches' ? 'bg-amber-400 text-zinc-950 font-semibold shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Inches (")
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('cm')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
                    unit === 'cm' ? 'bg-amber-400 text-zinc-950 font-semibold shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  cm
                </button>
              </div>
            </div>
          </div>

          {/* Core Body Measurements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Chest / Full Bust</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.chestBust}
                  onChange={(e) => handleChange('chestBust', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Waist (Natural)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.waist}
                  onChange={(e) => handleChange('waist', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Full Hips</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.hips}
                  onChange={(e) => handleChange('hips', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Shoulder Width (Acromion)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.shoulderWidth}
                  onChange={(e) => handleChange('shoulderWidth', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Sleeve Length (Wrist)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.sleeveLength}
                  onChange={(e) => handleChange('sleeveLength', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Garment Full Length</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.fullLength}
                  onChange={(e) => handleChange('fullLength', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Neck Circumference</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.neck || ''}
                  onChange={(e) => handleChange('neck', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Trouser Inseam</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.inseam || ''}
                  onChange={(e) => handleChange('inseam', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Agbada Wing Span</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={form.agbadaSpan || ''}
                  onChange={(e) => handleChange('agbadaSpan', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-[10px]">{unit}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Fitting & Posture Notes</label>
            <textarea
              rows={2}
              value={form.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Erect posture, hollow back dart adjustment required..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Card'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Record Client Measurements</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
