/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Film, Image as ImageIcon, Loader2, Wand2, FileText, 
  ChevronDown, Plus, Trash2, LayoutGrid, Settings, Sparkles,
  ArrowRight, CheckCircle2, AlertCircle, RefreshCcw, Play,
  Package, Briefcase, Database, Copy, Download, XCircle, Eye
} from 'lucide-react';

// 模拟产品库
const PRODUCT_DB = {
  "Apple": ["iPhone 16", "MacBook Pro"],
  "Sony": ["Alpha 7 IV", "WH-1000XM5"],
  "DJI": ["Mavic 3 Pro", "Osmo Pocket 3"]
};

const ManagerMode = ({ productDb, setProductDb, productImages, setProductImages, showToast }: any) => {
  const [newBrandName, setNewBrandName] = useState('');
  const [newProductNames, setNewProductNames] = useState<Record<string, string>>({});

  const handleAddBrand = () => {
    if (newBrandName.trim()) {
      setProductDb((prev: any) => ({ ...prev, [newBrandName.trim()]: [] }));
      setNewBrandName('');
    }
  };

  const handleAddProduct = (brand: string) => {
    const productName = newProductNames[brand];
    if (productName && productName.trim()) {
      setProductDb((prev: any) => ({
        ...prev,
        [brand]: [...(prev[brand] || []), productName.trim()]
      }));
      setNewProductNames(prev => ({ ...prev, [brand]: '' }));
    }
  };

  const handleDeleteBrand = (brand: string) => {
    setProductDb((prev: any) => {
      const next = { ...prev };
      delete next[brand];
      return next;
    });
  };

  const handleDeleteProduct = (brand: string, product: string) => {
    setProductDb((prev: any) => ({
      ...prev,
      [brand]: prev[brand].filter((p: string) => p !== product)
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900">产品资产库</h2>
          <p className="text-zinc-500 mt-2">管理您的品牌、产品及其参考图片，用于生成高质量的缺失镜头提示词。</p>
        </div>
        <div className="flex w-full md:w-auto gap-3 items-center">
          <button 
            onClick={() => {
              setProductDb({});
              setProductImages({});
              showToast('库已清空');
            }}
            className="px-4 py-2 text-zinc-400 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <XCircle size={18} />
            清空库
          </button>
          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-zinc-200">
            <input 
              type="text" 
              placeholder="新品牌名称..." 
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="flex-1 md:w-64 px-4 py-2 bg-zinc-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
            <button 
              onClick={handleAddBrand}
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={18} />
              添加品牌
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(productDb).map(([b, products]) => (
          <motion.div 
            key={b} 
            layout
            className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm"
          >
            <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
                  <Briefcase size={24} className="text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-zinc-900">{b}</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                    {(products as string[]).length} 个产品
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex gap-2 flex-1 sm:flex-none bg-white p-1.5 rounded-xl border border-zinc-200">
                  <input 
                    type="text" 
                    placeholder="新产品..." 
                    value={newProductNames[b] || ''}
                    onChange={(e) => setNewProductNames(prev => ({ ...prev, [b]: e.target.value }))}
                    className="flex-1 sm:w-40 px-3 py-1.5 bg-transparent text-sm outline-none"
                  />
                  <button 
                    onClick={() => handleAddProduct(b)}
                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => handleDeleteBrand(b)}
                  className="p-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="删除品牌"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {(products as string[]).map(p => (
                  <motion.div 
                    key={p} 
                    layout
                    className="group relative"
                  >
                    <div className="aspect-[4/5] bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden flex flex-col items-center justify-center transition-all group-hover:border-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-500/5">
                      {productImages[`${b}-${p}`] ? (
                        <img src={productImages[`${b}-${p}`]} alt={p} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 opacity-20">
                          <ImageIcon size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">No Image</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-white via-white to-transparent">
                        <input 
                          type="file" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => setProductImages((prev: any) => ({ ...prev, [`${b}-${p}`]: e.target?.result as string }));
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="hidden" 
                          id={`img-${b}-${p}`} 
                          accept="image/*" 
                        />
                        <label 
                          htmlFor={`img-${b}-${p}`} 
                          className="w-full py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 transition-all"
                        >
                          <Upload size={12} />
                          {productImages[`${b}-${p}`] ? '更换' : '上传'}
                        </label>
                      </div>

                      <button 
                        onClick={() => handleDeleteProduct(b, p)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm text-zinc-400 hover:text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-zinc-700 text-center truncate px-2">{p}</p>
                  </motion.div>
                ))}
                
                {(products as string[]).length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-3xl">
                    <Package size={40} className="text-zinc-200 mb-3" />
                    <p className="text-sm text-zinc-400 font-medium">该品牌下暂无产品</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {Object.keys(productDb).length === 0 && (
          <div className="py-32 text-center bg-white rounded-3xl border border-zinc-200 border-dashed">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database size={40} className="text-zinc-300" />
            </div>
            <h3 className="text-xl font-display font-bold text-zinc-900">资产库为空</h3>
            <p className="text-zinc-500 mt-2 max-w-xs mx-auto">请在上方添加您的第一个品牌，开始构建您的产品资产库。</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SettingsMode = ({ settings, setSettings, showToast }: any) => {
  const textModels = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (快速)', desc: '平衡速度与质量' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (强大)', desc: '更强的推理与细节' }
  ];

  const imageModels = [
    { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', desc: '快速生成高质量图像' },
    { id: 'gemini-3.1-flash-image-preview', name: 'Gemini 3.1 Flash Image', desc: '支持更高分辨率与细节' }
  ];

  const videoModels = [
    { id: 'veo-3.1-fast-generate-preview', name: 'Veo 3.1 Fast', desc: '快速生成视频预览' },
    { id: 'veo-3.1-generate-preview', name: 'Veo 3.1 High Quality', desc: '更高质量的视频生成' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900">项目全局设置</h2>
        <p className="text-zinc-500">配置您的生成模型偏好与输出参数，这些设置将应用于所有生成任务。</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Model Selection */}
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h3 className="text-lg font-bold">模型选择</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">文本/提示词模型</label>
                <select 
                  value={settings.textModel}
                  onChange={(e) => setSettings({ ...settings, textModel: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none"
                >
                  {textModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <p className="text-[10px] text-zinc-400 ml-1">{textModels.find(m => m.id === settings.textModel)?.desc}</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">生图模型</label>
                <select 
                  value={settings.imageModel}
                  onChange={(e) => setSettings({ ...settings, imageModel: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none"
                >
                  {imageModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <p className="text-[10px] text-zinc-400 ml-1">{imageModels.find(m => m.id === settings.imageModel)?.desc}</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">视频生成模型</label>
                <select 
                  value={settings.videoModel}
                  onChange={(e) => setSettings({ ...settings, videoModel: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none"
                >
                  {videoModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <p className="text-[10px] text-zinc-400 ml-1">{videoModels.find(m => m.id === settings.videoModel)?.desc}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          {/* Prompt Template */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-lg font-bold">提示词生成模板</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">自定义提示词模板</label>
                <button 
                  onClick={() => {
                    setSettings({
                      ...settings,
                      promptTemplate: '你是一个专业的短视频导演。请深度分析以下《缺失镜头报告》，找出报告中提到的每一个缺失镜头。不要遗漏任何一个。针对每一个缺失镜头，分别生成一段详细的文生图提示词（包含构图、主体动作、镜头运动、光影氛围、产品细节等）。\n\n产品信息：{{brand}} {{product}}\n人物设定：如果是人像，请设定为亚洲人\n输出语言：中文\n输出格式：必须返回一个纯字符串数组格式的 JSON，例如 ["镜头1提示词", "镜头2提示词", "镜头3提示词"]。严禁将多个镜头合并为一个字符串，严禁返回对象格式。\n\n报告内容：{{report}}'
                    });
                    showToast('已恢复默认模板');
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                >
                  恢复默认
                </button>
              </div>
              <textarea 
                value={settings.promptTemplate}
                onChange={(e) => setSettings({ ...settings, promptTemplate: e.target.value })}
                placeholder="输入您的提示词模板..."
                className="w-full h-40 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none font-mono"
              />
              <div className="flex flex-wrap gap-2">
                {['{{brand}}', '{{product}}', '{{report}}'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded text-[10px] font-mono">{tag}</span>
                ))}
              </div>
              <p className="text-[10px] text-zinc-400 ml-1">使用上述占位符，系统将在生成时自动替换为实际内容。</p>
            </div>
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          {/* Output Parameters */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <LayoutGrid size={18} />
              </div>
              <h3 className="text-lg font-bold">输出参数</h3>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">画面比例 (Aspect Ratio)</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSettings({ ...settings, aspectRatio: '9:16' })}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${settings.aspectRatio === '9:16' ? 'border-indigo-600 bg-indigo-50/50' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}
                >
                  <div className="w-8 h-12 border-2 border-current rounded-sm opacity-60" />
                  <div className="text-center">
                    <p className="text-sm font-bold">竖屏 (9:16)</p>
                    <p className="text-[10px] text-zinc-400 mt-1">适用于抖音、小红书、Reels</p>
                  </div>
                </button>
                <button 
                  onClick={() => setSettings({ ...settings, aspectRatio: '16:9' })}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${settings.aspectRatio === '16:9' ? 'border-indigo-600 bg-indigo-50/50' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}
                >
                  <div className="w-12 h-8 border-2 border-current rounded-sm opacity-60" />
                  <div className="text-center">
                    <p className="text-sm font-bold">横屏 (16:9)</p>
                    <p className="text-[10px] text-zinc-400 mt-1">适用于 YouTube、B站、电视</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="h-px bg-zinc-100 w-full" />

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">危险区域</label>
              <button 
                onClick={() => {
                  localStorage.removeItem('projectSettings');
                  localStorage.removeItem('productDb');
                  localStorage.removeItem('productImages');
                  window.location.reload();
                }}
                className="w-full py-4 border-2 border-red-100 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} />
                重置所有数据并刷新
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [report, setReport] = useState('');
  const [brand, setBrand] = useState('');
  const [product, setProduct] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [shots, setShots] = useState<{
    prompt: string;
    imageUrl: string | null;
    videoUrl: string | null;
    loadingImage: boolean;
    loadingVideo: boolean;
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'manage' | 'settings'>('generate');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('projectSettings');
    return saved ? JSON.parse(saved) : {
      textModel: 'gemini-3-flash-preview',
      imageModel: 'gemini-2.5-flash-image',
      videoModel: 'veo-3.1-fast-generate-preview',
      aspectRatio: '9:16',
      promptTemplate: '你是一个专业的短视频导演。请深度分析以下《缺失镜头报告》，找出报告中提到的每一个缺失镜头。不要遗漏任何一个。针对每一个缺失镜头，分别生成一段详细的文生图提示词（包含构图、主体动作、镜头运动、光影氛围、产品细节等）。\n\n产品信息：{{brand}} {{product}}\n人物设定：如果是人像，请设定为亚洲人\n输出语言：中文\n输出格式：必须返回一个纯字符串数组格式的 JSON，例如 ["镜头1提示词", "镜头2提示词", "镜头3提示词"]。严禁将多个镜头合并为一个字符串，严禁返回对象格式。\n\n报告内容：{{report}}'
    };
  });

  React.useEffect(() => {
    localStorage.setItem('projectSettings', JSON.stringify(settings));
  }, [settings]);
  const [productDb, setProductDb] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('productDb');
    return saved ? JSON.parse(saved) : {
      "Apple": ["iPhone 16", "MacBook Pro"],
      "Sony": ["Alpha 7 IV", "WH-1000XM5"],
      "DJI": ["Mavic 3 Pro", "Osmo Pocket 3"]
    };
  });
  const [productImages, setProductImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('productImages');
    return saved ? JSON.parse(saved) : {};
  });

  React.useEffect(() => {
    localStorage.setItem('productDb', JSON.stringify(productDb));
  }, [productDb]);

  React.useEffect(() => {
    localStorage.setItem('productImages', JSON.stringify(productImages));
  }, [productImages]);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! }); // Keep for non-handler usage if any, but handlers now create their own

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.md', '.markdown', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (isValid) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setReport(content);
          showToast('报告上传成功');
        } else {
          showToast('文件内容为空');
        }
      };
      reader.onerror = () => showToast('文件读取失败');
      reader.readAsText(file);
    } else {
      showToast('仅支持 .md, .markdown 或 .txt 文件');
    }
    // Reset input value to allow re-uploading the same file if needed
    e.target.value = '';
  };

  const handleGeneratePrompts = async () => {
    if (!brand || !product) {
      showToast('请先选择品牌和产品');
      return;
    }
    if (!report) {
      showToast('请先上传或输入缺失镜头报告');
      return;
    }

    setLoading(true);
    setLoadingStep('正在生成镜头提示词...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const finalPrompt = settings.promptTemplate
        .replaceAll('{{brand}}', brand)
        .replaceAll('{{product}}', product)
        .replaceAll('{{report}}', report);

      console.log("Sending prompt to AI...", { model: settings.textModel });
      
      const response = await ai.models.generateContent({
        model: settings.textModel,
        contents: finalPrompt,
        config: {
          // 显式关闭所有安全过滤，防止对专业术语的误判
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_NONE' as any },
            { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_NONE' as any },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
          ]
        }
      });
      
      const text = response.text;
      const candidate = response.candidates?.[0];

      if (!text) {
        if (candidate) {
          const reason = candidate.finishReason;
          if (reason === 'SAFETY') {
            throw new Error("内容被安全过滤器拦截。请检查报告中是否包含敏感词汇。");
          } else if (reason === 'RECITATION') {
            throw new Error("生成内容因版权保护被拦截。");
          } else {
            throw new Error(`AI 未返回文本。中断原因: ${reason}`);
          }
        } else if (response.promptFeedback?.blockReason) {
          throw new Error(`提示词被拦截: ${response.promptFeedback.blockReason}`);
        }
        throw new Error("AI 返回了空结果，请尝试简化报告内容或更换模型。");
      }

      console.log("AI Response text length:", text.length);
      
      let prompts: string[] = [];
      
      try {
        // 尝试处理可能存在的 Markdown 代码块
        let jsonText = text;
        if (jsonText.includes('```')) {
          const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (match) jsonText = match[1];
        }
        
        // 尝试解析 JSON
        const trimmedJson = jsonText.trim();
        if (trimmedJson.startsWith('[') || trimmedJson.startsWith('{')) {
          const rawData = JSON.parse(trimmedJson);
          prompts = Array.isArray(rawData) 
            ? rawData.map((item: any) => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item !== null) {
                  return item.prompt || item.description || item.text || JSON.stringify(item);
                }
                return String(item);
              })
            : [typeof rawData === 'string' ? rawData : JSON.stringify(rawData)];
        } else {
          throw new Error("Not a JSON array");
        }
      } catch (parseError) {
        console.warn("JSON parse failed, falling back to line-based parsing:", parseError);
        // 如果 JSON 解析失败，尝试按行解析
        // 1. 移除 Markdown 标记
        const cleanText = text.replace(/```(json)?/g, '').replace(/```/g, '').trim();
        // 2. 按行分割并过滤
        const lines = cleanText.split(/\n+/)
          .map(l => l.replace(/^\d+[\.\s、\-]+/, '').trim()) // 移除行首数字、点、空格、顿号、横杠
          .filter(l => l.length > 5 && !l.toLowerCase().includes('json') && !l.includes('[') && !l.includes(']'));
        
        if (lines.length > 0) {
          prompts = lines;
        } else {
          // 最后的保底：如果只有一段话，就当成一个镜头
          if (cleanText.length > 0) {
            prompts = [cleanText];
          }
        }
      }

      if (prompts.length > 0) {
        setShots(prompts.map(prompt => ({
          prompt,
          imageUrl: null,
          videoUrl: null,
          loadingImage: false,
          loadingVideo: false
        })));
        showToast(`成功提取 ${prompts.length} 个镜头`);
      } else {
        throw new Error("未能从 AI 响应中提取到有效的镜头描述");
      }
    } catch (error: any) {
      console.error("Generate prompts failed:", error);
      const msg = error.message || '';
      if (msg.includes('Quota exceeded')) {
        showToast('API 配额已耗尽，请稍后再试');
      } else if (msg.includes('API key not valid')) {
        showToast('API Key 无效，请检查配置');
      } else if (msg.includes('Safety')) {
        showToast('内容涉及敏感信息被拦截');
      } else {
        showToast(`生成失败: ${msg.slice(0, 60)}`);
      }
    } finally {
      setLoading(false);
      setLoadingStep(null);
    }
  };

  const handleGenerateImage = async (index: number) => {
    setShots(prev => prev.map((shot, i) => i === index ? { ...shot, loadingImage: true } : shot));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const shot = shots[index];
      const referenceImage = productImages[`${brand}-${product}`];
      
      const parts: any[] = [{ text: `根据以下描述生成一张高质量的产品摄影图。产品是 ${brand} ${product}。描述：${shot.prompt}。如果画面中出现人物，请确保是亚洲人。请确保画面真实、光影自然、构图专业，比例为${settings.aspectRatio}。` }];
      
      if (referenceImage) {
        parts.push({
          inlineData: {
            data: referenceImage.split(',')[1],
            mimeType: "image/png"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: settings.imageModel,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: settings.aspectRatio
          }
        }
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) throw new Error("No image data received");

      setShots(prev => prev.map((shot, i) => i === index ? { ...shot, imageUrl: imageUrl || shot.imageUrl, loadingImage: false } : shot));
      showToast('预览图生成成功');
    } catch (error: any) {
      console.error("Image generation failed:", error);
      showToast(error.message?.includes('Quota exceeded') ? 'API 配额已耗尽' : '生图失败，请重试');
      setShots(prev => prev.map((shot, i) => i === index ? { ...shot, loadingImage: false } : shot));
    }
  };

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('提示词已复制到剪贴板');
  };

  const handleDownloadPrompts = () => {
    const text = shots.map((s, i) => `镜头 ${i + 1}:\n${s.prompt}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `缺失镜头提示词_${brand}_${product}.txt`;
    a.click();
  };

  const handleGenerateVideo = async (index: number) => {
    setShots(prev => prev.map((shot, i) => i === index ? { ...shot, loadingVideo: true } : shot));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      console.log(`Using video model: ${settings.videoModel}`);
      // 模拟视频生成延迟
      setTimeout(() => {
        setShots(prev => prev.map((shot, i) => i === index ? { ...shot, videoUrl: 'video-placeholder', loadingVideo: false } : shot));
        showToast('视频生成成功（演示模式）');
      }, 3000);
    } catch (error: any) {
      console.error("Video generation failed:", error);
      showToast('视频生成失败');
      setShots(prev => prev.map((shot, i) => i === index ? { ...shot, loadingVideo: false } : shot));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold tracking-wide flex items-center gap-3"
          >
            <CheckCircle2 className="text-emerald-400" size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-zinc-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">缺失镜头生成器 <span className="text-zinc-400 font-normal ml-1">v2.0</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {shots.length > 0 && (
              <button 
                onClick={handleDownloadPrompts}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Download size={16} />
                导出结果
              </button>
            )}
            <nav className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <LayoutGrid size={16} />
              生成模式
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'manage' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Database size={16} />
              管理模式
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Settings size={16} />
              项目设置
            </button>
          </nav>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'manage' ? (
            <ManagerMode 
              key="manager"
              productDb={productDb} 
              setProductDb={setProductDb} 
              productImages={productImages} 
              setProductImages={setProductImages} 
              showToast={showToast}
            />
          ) : activeTab === 'settings' ? (
            <SettingsMode 
              key="settings"
              settings={settings}
              setSettings={setSettings}
              showToast={showToast}
            />
          ) : (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Sidebar Config */}
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <LayoutGrid size={18} />
                    </div>
                    <h2 className="text-lg font-display font-bold">配置生成参数</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">选择品牌与产品</label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="relative group">
                          <select 
                            className="w-full appearance-none bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium pr-10 group-hover:border-zinc-300" 
                            onChange={(e) => {setBrand(e.target.value); setProduct('')}}
                          >
                            <option value="">选择品牌</option>
                            {Object.keys(productDb).map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-zinc-600 transition-colors" size={16} />
                        </div>
                        
                        <div className="relative group">
                          <select 
                            className="w-full appearance-none bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium pr-10 disabled:opacity-50 group-hover:border-zinc-300" 
                            value={product} 
                            onChange={(e) => setProduct(e.target.value)} 
                            disabled={!brand}
                          >
                            <option value="">选择产品</option>
                            {brand && (productDb[brand] || []).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-zinc-600 transition-colors" size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">缺失镜头报告</label>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setReport("# 缺失镜头报告\n\n1. 产品特写：展示产品的侧面按键细节，光影柔和。\n2. 使用场景：模特在户外使用产品，环境温馨自然。\n3. 动态镜头：产品在高速移动中的特写画面，带有动态模糊。");
                                showToast('已加载示例报告');
                              }}
                              className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                            >
                              加载示例
                            </button>
                            <button 
                              onClick={() => setReport('')}
                              className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
                            >
                              清空
                            </button>
                          </div>
                        </div>
                        <textarea 
                          value={report}
                          onChange={(e) => setReport(e.target.value)}
                          placeholder="在此粘贴报告内容..."
                          className="w-full h-32 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">或上传 .md 文件</label>
                        <div className={`relative group border-2 border-dashed rounded-3xl p-6 text-center transition-all ${report ? 'border-emerald-200 bg-emerald-50/30' : 'border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50/30'}`}>
                          <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" id="md-upload" accept=".md,.markdown,.txt" />
                          <div className="flex flex-col items-center">
                            {report ? (
                              <div className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle2 size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">报告已就绪</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="text-zinc-300 mb-2" size={24} />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">点击上传报告</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGeneratePrompts}
                      disabled={loading || !report || !product}
                      className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 active:scale-[0.98] shadow-lg shadow-zinc-900/10"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="animate-spin" size={20} />
                          <span className="text-[10px] lowercase">{loadingStep || '处理中...'}</span>
                        </div>
                      ) : (
                        <>
                          <Wand2 size={20} />
                          生成提示词
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <div className="bg-indigo-600 p-8 rounded-3xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-display font-bold mb-2">AI 智能分析</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed opacity-80">
                      系统将自动分析报告中的缺失镜头，并结合产品库中的品牌调性生成专业的视觉提示词。
                    </p>
                  </div>
                  <Sparkles className="absolute -right-4 -bottom-4 text-indigo-500 opacity-30" size={120} />
                </div>
              </div>

              {/* Main Results Area */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden min-h-[600px]">
                  <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-50 text-zinc-600 rounded-lg flex items-center justify-center">
                        <Film size={18} />
                      </div>
                      <h2 className="text-lg font-display font-bold">生成结果列表</h2>
                    </div>
                    {shots.length > 0 && (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            setShots([]);
                            showToast('已清空结果');
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 py-1.5 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={12} />
                          清空结果
                        </button>
                        <button 
                          onClick={handleDownloadPrompts}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white px-5 py-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Download size={14} />
                          导出全部提示词
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-100">
                          {shots.length} 个镜头
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    {shots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                          <Film size={40} className="opacity-20" />
                        </div>
                        <h3 className="text-zinc-900 font-bold mb-2">等待生成</h3>
                        <p className="text-sm text-zinc-500 max-w-xs text-center">
                          在左侧配置您的产品并上传缺失镜头报告，点击生成按钮开始。
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        {shots.map((shot, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            <div className="flex flex-col md:flex-row gap-8">
                              <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">镜头描述</h4>
                                </div>
                                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all relative">
                                  <p className="text-sm text-zinc-700 leading-relaxed font-medium pr-8">{shot.prompt}</p>
                                  <button 
                                    onClick={() => handleCopyPrompt(shot.prompt)}
                                    className="absolute top-4 right-4 text-zinc-300 hover:text-indigo-600 transition-colors"
                                    title="复制提示词"
                                  >
                                    <Copy size={16} />
                                  </button>
                                </div>
                                
                                <div className="flex gap-3 pt-2">
                                  <button 
                                    onClick={() => handleGenerateImage(index)}
                                    disabled={shot.loadingImage || shot.loadingVideo}
                                    className="flex-1 h-11 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all active:scale-95 disabled:opacity-50"
                                  >
                                    {shot.loadingImage ? <Loader2 className="animate-spin" size={14} /> : <RefreshCcw size={14} />}
                                    {shot.imageUrl ? '重新生成' : '生成预览图'}
                                  </button>
                                  <button 
                                    onClick={() => handleGenerateVideo(index)}
                                    disabled={!shot.imageUrl || shot.loadingImage || shot.loadingVideo}
                                    className="flex-1 h-11 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-400"
                                  >
                                    {shot.loadingVideo ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
                                    生成视频
                                  </button>
                                </div>
                              </div>

                               <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0">
                                <div className="flex flex-col sm:flex-row gap-4">
                                  {/* Image Box */}
                                  <div className={`shrink-0 ${settings.aspectRatio === '9:16' ? 'w-40 sm:w-48' : 'w-full sm:w-72'}`}>
                                    <div className={`bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden relative shadow-inner group/img transition-all ${settings.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}>
                                      {shot.imageUrl ? (
                                        <>
                                          <img 
                                            src={shot.imageUrl} 
                                            alt="Shot Preview" 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" 
                                            referrerPolicy="no-referrer" 
                                          />
                                          <button 
                                            onClick={() => setPreviewImage(shot.imageUrl)}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 backdrop-blur-[2px]"
                                          >
                                            <Eye size={20} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">预览大图</span>
                                          </button>
                                        </>
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                                          <ImageIcon size={32} />
                                          <span className="text-[8px] font-bold uppercase tracking-widest">待生成图片</span>
                                        </div>
                                      )}
                                      
                                      {shot.loadingImage && (
                                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                                          <Loader2 className="animate-spin text-indigo-600" size={24} />
                                          <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-600">渲染中...</span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 text-center">预览画面</p>
                                  </div>

                                  {/* Video Box */}
                                  <div className={`shrink-0 ${settings.aspectRatio === '9:16' ? 'w-40 sm:w-48' : 'w-full sm:w-72'}`}>
                                    <div className={`bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden relative shadow-inner transition-all ${settings.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}>
                                      {shot.videoUrl ? (
                                        <video 
                                          src={shot.videoUrl} 
                                          controls 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40 text-zinc-500">
                                          <Film size={32} />
                                          <span className="text-[8px] font-bold uppercase tracking-widest">待生成视频</span>
                                        </div>
                                      )}
                                      
                                      {shot.loadingVideo && (
                                        <div className="absolute inset-0 bg-indigo-600/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                                          <Loader2 className="animate-spin" size={24} />
                                          <span className="text-[8px] font-bold uppercase tracking-widest">合成中...</span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 text-center">动态视频</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index < shots.length - 1 && (
                              <div className="h-px bg-zinc-100 w-full my-10" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={previewImage} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <XCircle size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <Sparkles size={18} />
            <span className="text-sm font-medium">AI 驱动的视觉内容生产助手</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase">
            © 2026 Visual Production Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
