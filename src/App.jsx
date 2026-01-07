import { useState, useMemo } from "react";
import { Users, Building2, ChevronRight, ChevronLeft, Clock, Truck, GripVertical, MapPin, AlertCircle, CheckCircle, User, Award, Car, Zap, RefreshCw, ArrowRight, AlertTriangle, Calendar, Wrench, Plane, Heart, X } from "lucide-react";

// 車両データ（稼働状況付き）
const initialVehicles = [
  { id: "201", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "202", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "203", capacity: 3, status: "inspection", statusNote: "車検", unavailableUntil: "2025-06-05" },
  { id: "206", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "208", capacity: 4, status: "breakdown", statusNote: "エンジン不調", unavailableUntil: "2025-06-10" },
  { id: "211", capacity: 3, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "212", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "223", capacity: 4, status: "maintenance", statusNote: "定期点検", unavailableUntil: "2025-06-01" },
  { id: "302", capacity: 5, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "303", capacity: 3, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "304", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "305", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "306", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "308", capacity: 3, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "402", capacity: 5, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "404", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
  { id: "408", capacity: 4, status: "available", statusNote: "", unavailableUntil: "" },
];

const vehicleStatuses = {
  available: { label: "稼働可", color: "#43a047", bg: "#e8f5e9" },
  breakdown: { label: "故障", color: "#e53935", bg: "#ffebee" },
  inspection: { label: "車検", color: "#f57c00", bg: "#fff3e0" },
  maintenance: { label: "点検", color: "#1976d2", bg: "#e3f2fd" },
};

// 作業員マスタ（稼働状況付き）
const initialWorkers = [
  { id: 1, name: "田中", fullName: "田中太郎", licenses: ["第一種電気工事士", "低圧電気取扱"], skills: ["配線", "盤設置", "高圧"], experience: 15, location: "東京", phone: "090-1234-5678", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 2, name: "山田", fullName: "山田花子", licenses: ["第二種電気工事士"], skills: ["配線", "照明"], experience: 8, location: "東京", phone: "090-2345-6789", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 3, name: "佐藤", fullName: "佐藤健一", licenses: ["第一種電気工事士", "電気主任技術者3種"], skills: ["高圧", "盤設置", "検査"], experience: 20, location: "神奈川", phone: "090-3456-7890", status: "injury", statusNote: "腰痛療養中", unavailableUntil: "2025-06-15", workerType: "regular" },
  { id: 4, name: "鈴木", fullName: "鈴木美咲", licenses: ["足場組立作業主任者", "玉掛け"], skills: ["足場", "搬入"], experience: 5, location: "東京", phone: "090-4567-8901", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 5, name: "高橋", fullName: "高橋大輔", licenses: ["第二種電気工事士", "足場組立"], skills: ["配線", "足場"], experience: 10, location: "埼玉", phone: "090-5678-9012", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 6, name: "伊藤", fullName: "伊藤さくら", licenses: ["第一種電気工事士"], skills: ["配線", "検査"], experience: 12, location: "千葉", phone: "090-6789-0123", status: "vacation", statusNote: "夏季休暇", unavailableUntil: "2025-06-07", workerType: "regular" },
  { id: 7, name: "渡辺", fullName: "渡辺誠", licenses: ["電気主任技術者3種", "第一種電気工事士"], skills: ["高圧", "検査", "盤設置"], experience: 25, location: "東京", phone: "090-7890-1234", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 8, name: "中村", fullName: "中村優子", licenses: ["第二種電気工事士"], skills: ["配線", "照明"], experience: 3, location: "神奈川", phone: "090-8901-2345", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 9, name: "グエン", fullName: "グエン・バン・ミン", licenses: ["第二種電気工事士"], skills: ["配線", "搬入"], experience: 2, location: "東京", phone: "090-9012-3456", status: "abroad", statusNote: "ベトナム一時帰国", unavailableUntil: "2025-06-20", workerType: "trainee" },
  { id: 10, name: "加藤", fullName: "加藤真一", licenses: ["第二種電気工事士"], skills: ["配線"], experience: 4, location: "埼玉", phone: "090-0123-4567", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 11, name: "吉田", fullName: "吉田恵", licenses: ["第一種電気工事士"], skills: ["配線", "照明", "検査"], experience: 9, location: "千葉", phone: "090-1111-2222", status: "available", statusNote: "", unavailableUntil: "", workerType: "regular" },
  { id: 12, name: "リー", fullName: "リー・ウェイ", licenses: ["第二種電気工事士"], skills: ["配線", "照明"], experience: 1, location: "東京", phone: "090-2222-3333", status: "available", statusNote: "", unavailableUntil: "", workerType: "trainee" },
];

const workerStatuses = {
  available: { label: "稼働可", color: "#43a047", bg: "#e8f5e9", icon: CheckCircle },
  vacation: { label: "休暇", color: "#1976d2", bg: "#e3f2fd", icon: Calendar },
  injury: { label: "怪我/病気", color: "#e53935", bg: "#ffebee", icon: Heart },
  abroad: { label: "一時帰国", color: "#7b1fa2", bg: "#f3e5f5", icon: Plane },
};

const workerTypes = {
  regular: { label: "正社員", color: "#333" },
  trainee: { label: "技能実習生", color: "#7b1fa2" },
};

// エリア間の移動時間（分）
const travelTimes = {
  "新宿": { "新宿": 15, "池袋": 25, "渋谷": 20, "横浜": 50, "品川": 25, "日本橋": 20, "千葉": 60, "銀座": 20 },
  "池袋": { "新宿": 25, "池袋": 15, "渋谷": 30, "横浜": 60, "品川": 35, "日本橋": 25, "千葉": 55, "銀座": 30 },
  "渋谷": { "新宿": 20, "池袋": 30, "渋谷": 15, "横浜": 40, "品川": 20, "日本橋": 25, "千葉": 65, "銀座": 20 },
  "横浜": { "新宿": 50, "池袋": 60, "渋谷": 40, "横浜": 15, "品川": 30, "日本橋": 45, "千葉": 90, "銀座": 40 },
  "品川": { "新宿": 25, "池袋": 35, "渋谷": 20, "横浜": 30, "品川": 15, "日本橋": 15, "千葉": 50, "銀座": 10 },
  "日本橋": { "新宿": 20, "池袋": 25, "渋谷": 25, "横浜": 45, "品川": 15, "日本橋": 10, "千葉": 45, "銀座": 5 },
  "千葉": { "新宿": 60, "池袋": 55, "渋谷": 65, "横浜": 90, "品川": 50, "日本橋": 45, "千葉": 15, "銀座": 50 },
  "銀座": { "新宿": 20, "池袋": 30, "渋谷": 20, "横浜": 40, "品川": 10, "日本橋": 5, "千葉": 50, "銀座": 10 },
};
const getTravelTime = (from, to) => travelTimes[from]?.[to] || 45;

// 現場データ
const initialSites = [
  { id: 1, client: "増田工務", name: "新宿南口 3F", area: "新宿", need: 2, slot: "morning", startTime: "8:00", endTime: "12:00", requiredSkills: ["配線", "盤設置"], notes: "分電盤取付", priority: "高", workerIds: [], vehicleId: "" },
  { id: 2, client: "増田工務", name: "新宿南口 2F", area: "新宿", need: 2, slot: "afternoon", startTime: "13:00", endTime: "17:00", requiredSkills: ["配線"], notes: "コンセント増設", priority: "高", workerIds: [], vehicleId: "" },
  { id: 3, client: "丹青社", name: "しゃぶ葉 池袋", area: "池袋", need: 2, slot: "morning", startTime: "8:30", endTime: "12:00", requiredSkills: ["照明"], notes: "店舗照明", priority: "中", workerIds: [], vehicleId: "" },
  { id: 4, client: "天装社", name: "グリーンクリプス", area: "渋谷", need: 2, slot: "fullday", startTime: "8:00", endTime: "17:00", requiredSkills: ["配線"], notes: "天井配線", priority: "中", workerIds: [], vehicleId: "" },
  { id: 5, client: "天装社", name: "プラーカ N2808", area: "横浜", need: 3, slot: "morning", startTime: "8:00", endTime: "12:00", requiredSkills: ["足場", "搬入"], notes: "搬入、足場組立", priority: "高", workerIds: [], vehicleId: "" },
  { id: 6, client: "帆-ル", name: "28F北側", area: "品川", need: 2, slot: "afternoon", startTime: "13:00", endTime: "17:00", requiredSkills: ["高圧"], notes: "ケーブルラック", priority: "中", workerIds: [], vehicleId: "" },
  { id: 7, client: "高島屋", name: "通路LED交換", area: "日本橋", need: 3, slot: "morning", startTime: "6:00", endTime: "10:00", requiredSkills: ["照明"], notes: "早朝作業", priority: "高", workerIds: [], vehicleId: "" },
  { id: 8, client: "船場", name: "ホテルマンマリーネ", area: "千葉", need: 2, slot: "fullday", startTime: "9:00", endTime: "18:00", requiredSkills: ["配線"], notes: "TV配線", priority: "中", workerIds: [], vehicleId: "" },
];

const slotLabels = { morning: "午前", afternoon: "午後", fullday: "終日", evening: "夜間" };
const slotColors = { morning: "#e3f2fd", afternoon: "#fff3e0", fullday: "#e8f5e9", evening: "#f3e5f5" };
const slotBorders = { morning: "#1976d2", afternoon: "#f57c00", fullday: "#43a047", evening: "#7b1fa2" };

const timeToMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
const slotsOverlap = (slot1, slot2) => slot1 === "fullday" || slot2 === "fullday" || slot1 === slot2;

export default function SAIHAIApp() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [sites, setSites] = useState(initialSites);
  const [activeTab, setActiveTab] = useState("assignment");
  const [selectedDate, setSelectedDate] = useState(new Date("2025-05-31"));
  const [showWorkerPicker, setShowWorkerPicker] = useState(null);
  const [dragWorker, setDragWorker] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeLog, setOptimizeLog] = useState([]);
  const [editingWorkerStatus, setEditingWorkerStatus] = useState(null);
  const [editingVehicleStatus, setEditingVehicleStatus] = useState(null);

  const dateStr = `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
  const currentDateStr = selectedDate.toISOString().split('T')[0];
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  // 稼働可能な作業員（選択日時点）
  const availableWorkers = useMemo(() => {
    return workers.filter(w => {
      if (w.status !== "available") {
        if (w.unavailableUntil && w.unavailableUntil < currentDateStr) {
          return true; // 復帰済み
        }
        return false;
      }
      return true;
    });
  }, [workers, currentDateStr]);

  // 稼働可能な車両（選択日時点）
  const availableVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (v.status !== "available") {
        if (v.unavailableUntil && v.unavailableUntil < currentDateStr) {
          return true;
        }
        return false;
      }
      return true;
    });
  }, [vehicles, currentDateStr]);

  // 非稼働の作業員・車両
  const unavailableWorkers = workers.filter(w => !availableWorkers.includes(w));
  const unavailableVehicles = vehicles.filter(v => !availableVehicles.includes(v));

  // 作業員の配置状況
  const getWorkerSlots = (workerId) => sites.filter(s => s.workerIds.includes(workerId)).map(s => ({ siteId: s.id, slot: s.slot, area: s.area, endTime: s.endTime }));

  const canAssignWorker = (workerId, siteId) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker || !availableWorkers.includes(worker)) return false;
    const site = sites.find(s => s.id === siteId);
    if (!site) return false;
    const workerSlots = getWorkerSlots(workerId);
    for (const ws of workerSlots) {
      if (slotsOverlap(ws.slot, site.slot)) return false;
    }
    return true;
  };

  const getAvailableWorkersForSite = (siteId) => {
    return availableWorkers.filter(w => !sites.find(s => s.id === siteId)?.workerIds.includes(w.id) && canAssignWorker(w.id, siteId));
  };

  const addWorker = (siteId, workerId) => {
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, workerIds: [...s.workerIds, workerId] } : s));
    setShowWorkerPicker(null);
  };
  const removeWorker = (siteId, workerId) => {
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, workerIds: s.workerIds.filter(id => id !== workerId) } : s));
  };
  const updateVehicle = (siteId, vehicleId) => {
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, vehicleId } : s));
  };

  const handleDrop = (siteId) => {
    if (dragWorker && canAssignWorker(dragWorker.id, siteId)) {
      addWorker(siteId, dragWorker.id);
    }
    setDragWorker(null);
  };

  // 作業員ステータス更新
  const updateWorkerStatus = (workerId, status, note, until) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, status, statusNote: note, unavailableUntil: until } : w));
    setEditingWorkerStatus(null);
  };

  // 車両ステータス更新
  const updateVehicleStatus = (vehicleId, status, note, until) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status, statusNote: note, unavailableUntil: until } : v));
    setEditingVehicleStatus(null);
  };

  // 自動配置
  const runAutoAssignment = () => {
    setIsOptimizing(true);
    setOptimizeLog([]);
    
    setTimeout(() => {
      const logs = [];
      let newSites = sites.map(s => ({ ...s, workerIds: [], vehicleId: "" }));
      
      logs.push("🚀 自動配置を開始...");
      logs.push(`👷 稼働可能: ${availableWorkers.length}名 / ${workers.length}名`);
      logs.push(`🚗 稼働可能: ${availableVehicles.length}台 / ${vehicles.length}台`);
      
      if (unavailableWorkers.length > 0) {
        logs.push(`⚠️ 非稼働: ${unavailableWorkers.map(w => `${w.name}(${workerStatuses[w.status].label})`).join(", ")}`);
      }
      
      const sortedSites = [...newSites].sort((a, b) => {
        const po = { "高": 0, "中": 1, "低": 2 };
        return po[a.priority] - po[b.priority] || timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      });
      
      const workerSchedule = {};
      availableWorkers.forEach(w => { workerSchedule[w.id] = []; });
      const usedVehicles = new Set();
      
      for (const site of sortedSites) {
        logs.push(`\n📍 ${site.name}（${slotLabels[site.slot]}）`);
        
        const candidates = availableWorkers.map(worker => {
          let score = 0;
          const schedule = workerSchedule[worker.id] || [];
          if (schedule.some(sch => slotsOverlap(sch.slot, site.slot))) return null;
          
          const matchedSkills = site.requiredSkills.filter(s => worker.skills.includes(s));
          score += matchedSkills.length * 30 + Math.min(worker.experience, 15);
          
          if (schedule.length > 0) {
            const last = schedule[schedule.length - 1];
            const travel = getTravelTime(last.area, site.area);
            if (timeToMinutes(last.endTime) + travel > timeToMinutes(site.startTime)) return null;
            score += Math.max(0, 60 - travel);
          }
          return { worker, score };
        }).filter(Boolean).sort((a, b) => b.score - a.score);
        
        let assigned = 0;
        const names = [];
        for (const c of candidates) {
          if (assigned >= site.need) break;
          const idx = newSites.findIndex(s => s.id === site.id);
          newSites[idx].workerIds.push(c.worker.id);
          workerSchedule[c.worker.id].push({ slot: site.slot, area: site.area, endTime: site.endTime });
          names.push(c.worker.name);
          assigned++;
        }
        
        if (names.length) logs.push(`  ✅ ${names.join(", ")}`);
        if (assigned < site.need) logs.push(`  ⚠️ ${site.need - assigned}名不足`);
        
        const vehicle = availableVehicles.find(v => !usedVehicles.has(v.id) && v.capacity >= assigned);
        if (vehicle && assigned > 0) {
          newSites[newSites.findIndex(s => s.id === site.id)].vehicleId = vehicle.id;
          usedVehicles.add(vehicle.id);
          logs.push(`  🚗 ${vehicle.id}`);
        }
      }
      
      logs.push(`\n━━━━━━━━━━━━━━━━`);
      logs.push(`✨ 完了`);
      
      setSites(newSites);
      setOptimizeLog(logs);
      setIsOptimizing(false);
    }, 1000);
  };

  const resetAssignment = () => {
    setSites(prev => prev.map(s => ({ ...s, workerIds: [], vehicleId: "" })));
    setOptimizeLog([]);
  };

  const getWorker = (id) => workers.find(w => w.id === id);
  const stats = useMemo(() => ({
    assigned: new Set(sites.flatMap(s => s.workerIds)).size,
    shortage: sites.filter(s => s.workerIds.length < s.need).length,
  }), [sites]);
  const sitesBySlot = useMemo(() => {
    const g = { morning: [], afternoon: [], fullday: [], evening: [] };
    sites.forEach(s => g[s.slot]?.push(s));
    return g;
  }, [sites]);

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoMark}>采</div>
          <span style={styles.logoText}>SAIHAI</span>
        </div>
        <nav style={styles.nav}>
          {[
            { id: "assignment", icon: Building2, label: "配置表" },
            { id: "timeline", icon: Clock, label: "タイムライン" },
            { id: "workers", icon: Users, label: "作業員" },
            { id: "vehicles", icon: Truck, label: "車両" },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{...styles.navItem, ...(activeTab === item.id ? styles.navItemActive : {})}}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.id === "workers" && unavailableWorkers.length > 0 && <span style={styles.navBadge}>{unavailableWorkers.length}</span>}
              {item.id === "vehicles" && unavailableVehicles.length > 0 && <span style={styles.navBadge}>{unavailableVehicles.length}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>
              {activeTab === "assignment" && "配置表"}
              {activeTab === "timeline" && "タイムライン"}
              {activeTab === "workers" && "作業員管理"}
              {activeTab === "vehicles" && "車両管理"}
            </h1>
            {(activeTab === "assignment" || activeTab === "timeline") && (
              <div style={styles.dateNav}>
                <button onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate()-1); return n; })} style={styles.dateBtn}><ChevronLeft size={18}/></button>
                <span style={styles.dateText}>{dateStr}（{dayNames[selectedDate.getDay()]}）</span>
                <button onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate()+1); return n; })} style={styles.dateBtn}><ChevronRight size={18}/></button>
              </div>
            )}
          </div>
          {activeTab === "assignment" && (
            <div style={styles.headerRight}>
              <div style={styles.headerStats}>
                <span style={styles.headerStat}>👷 <strong>{stats.assigned}</strong>/{availableWorkers.length}名</span>
                {stats.shortage > 0 && <span style={styles.headerStatAlert}><AlertCircle size={14}/>{stats.shortage}件不足</span>}
              </div>
              <button onClick={resetAssignment} style={styles.resetBtn}><RefreshCw size={14}/>リセット</button>
              <button onClick={runAutoAssignment} disabled={isOptimizing} style={styles.autoBtn}><Zap size={16}/>{isOptimizing ? "計算中..." : "自動配置"}</button>
            </div>
          )}
        </header>

        <div style={styles.content}>
          {/* ===== 配置表 ===== */}
          {activeTab === "assignment" && (
            <div style={styles.assignmentLayout}>
              <div style={styles.slotColumns}>
                {["morning", "afternoon", "fullday"].map(slot => (
                  <div key={slot} style={styles.slotColumn}>
                    <div style={{...styles.slotHeader, background: slotColors[slot], borderColor: slotBorders[slot]}}>
                      <span style={{...styles.slotLabel, color: slotBorders[slot]}}>{slotLabels[slot]}</span>
                      <span style={styles.slotCount}>{sitesBySlot[slot].length}件</span>
                    </div>
                    <div style={styles.slotCards}>
                      {sitesBySlot[slot].map(site => {
                        const siteWorkers = site.workerIds.map(getWorker).filter(Boolean);
                        const isShort = siteWorkers.length < site.need;
                        const avail = getAvailableWorkersForSite(site.id);
                        return (
                          <div key={site.id} style={{...styles.siteCard, borderLeftColor: site.priority === "高" ? "#e53935" : site.priority === "中" ? "#fb8c00" : "#43a047"}} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(site.id)}>
                            <div style={styles.siteCardHeader}>
                              <span style={styles.siteClient}>{site.client}</span>
                              <span style={styles.siteTime}>{site.startTime}〜{site.endTime}</span>
                            </div>
                            <div style={styles.siteName}>{site.name}</div>
                            <div style={styles.siteMeta}><MapPin size={11}/> {site.area}</div>
                            <div style={styles.siteWorkers}>
                              <div style={styles.workerHeader}>
                                <span style={{color: isShort ? "#e53935" : "#333"}}>{siteWorkers.length}/{site.need}名</span>
                                {isShort && <span style={styles.shortBadge}>不足</span>}
                              </div>
                              <div style={styles.workerChips}>
                                {siteWorkers.map(w => (
                                  <div key={w.id} style={styles.workerChip} draggable onDragStart={() => setDragWorker(w)}>
                                    {w.name}
                                    <button onClick={() => removeWorker(site.id, w.id)} style={styles.removeBtn}>×</button>
                                  </div>
                                ))}
                                <button onClick={() => setShowWorkerPicker(showWorkerPicker === site.id ? null : site.id)} style={styles.addBtn}>+</button>
                              </div>
                              {showWorkerPicker === site.id && (
                                <div style={styles.picker}>
                                  {avail.length === 0 ? <div style={styles.pickerEmpty}>配置可能な作業員なし</div> : avail.map(w => (
                                    <div key={w.id} style={styles.pickerItem} onClick={() => addWorker(site.id, w.id)}>
                                      <span>{w.name}</span>
                                      {w.workerType === "trainee" && <span style={styles.traineeBadge}>実習</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={styles.siteVehicle}>
                              <Car size={12}/>
                              <select value={site.vehicleId} onChange={e => updateVehicle(site.id, e.target.value)} style={styles.vehicleSelect}>
                                <option value="">-</option>
                                {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={styles.rightPanel}>
                {optimizeLog.length > 0 && (
                  <div style={styles.logPanel}>
                    <div style={styles.logHeader}>配置ログ</div>
                    <div style={styles.logContent}>{optimizeLog.map((l,i) => <div key={i}>{l}</div>)}</div>
                  </div>
                )}
                
                {/* 非稼働者表示 */}
                {unavailableWorkers.length > 0 && (
                  <div style={styles.unavailablePanel}>
                    <div style={styles.unavailableHeader}><AlertTriangle size={14}/> 本日非稼働</div>
                    {unavailableWorkers.map(w => (
                      <div key={w.id} style={styles.unavailableItem}>
                        <span>{w.name}</span>
                        <span style={{...styles.statusBadge, background: workerStatuses[w.status].bg, color: workerStatuses[w.status].color}}>{workerStatuses[w.status].label}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={styles.workerPanel}>
                  <div style={styles.panelHeader}>稼働可能 ({availableWorkers.length}名)</div>
                  <div style={styles.workerList}>
                    {availableWorkers.map(w => {
                      const slots = getWorkerSlots(w.id);
                      return (
                        <div key={w.id} style={styles.workerRow} draggable onDragStart={() => setDragWorker(w)}>
                          <GripVertical size={12} style={{color:"#ccc"}}/>
                          <span style={styles.workerRowName}>{w.name}</span>
                          {w.workerType === "trainee" && <span style={styles.traineeMark}>実</span>}
                          <div style={styles.workerSlots}>
                            {slots.length === 0 && <span style={styles.offTag}>空</span>}
                            {slots.map((s,i) => <span key={i} style={{...styles.slotTag, background: slotColors[s.slot]}}>{slotLabels[s.slot].charAt(0)}</span>)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== タイムライン ===== */}
          {activeTab === "timeline" && (
            <div style={styles.timelineCard}>
              <div style={styles.timelineWrapper}>
                <div style={styles.timelineHeader}>
                  <div style={styles.timelineWorkerCol}>作業員</div>
                  <div style={styles.timelineHours}>{Array.from({length: 16}, (_, i) => i + 5).map(h => <div key={h} style={styles.timelineHour}>{h}</div>)}</div>
                </div>
                {workers.map(worker => {
                  const isAvailable = availableWorkers.includes(worker);
                  const workerSites = sites.filter(s => s.workerIds.includes(worker.id)).sort((a,b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
                  return (
                    <div key={worker.id} style={{...styles.timelineRow, opacity: isAvailable ? 1 : 0.4}}>
                      <div style={styles.timelineWorkerCol}>
                        <div style={{...styles.timelineAvatar, background: isAvailable ? "#1976d2" : "#bbb"}}>{worker.name.charAt(0)}</div>
                        <div>
                          <span style={styles.timelineWorkerName}>{worker.name}</span>
                          {!isAvailable && <span style={styles.timelineStatus}>{workerStatuses[worker.status].label}</span>}
                        </div>
                      </div>
                      <div style={styles.timelineBar}>
                        {isAvailable ? (
                          <>
                            {workerSites.map((site, i) => {
                              const left = ((timeToMinutes(site.startTime) - 300) / 960) * 100;
                              const width = ((timeToMinutes(site.endTime) - timeToMinutes(site.startTime)) / 960) * 100;
                              return <div key={i} style={{...styles.timelineBlock, left: `${left}%`, width: `${width}%`, background: slotColors[site.slot], borderColor: slotBorders[site.slot]}}><span style={styles.timelineBlockText}>{site.area}</span></div>;
                            })}
                            {workerSites.length === 0 && <span style={styles.timelineOff}>空き</span>}
                          </>
                        ) : (
                          <div style={styles.timelineUnavailable}>{workerStatuses[worker.status].label} 〜{worker.unavailableUntil}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== 作業員管理 ===== */}
          {activeTab === "workers" && (
            <div style={styles.masterLayout}>
              <div style={styles.masterList}>
                {workers.map(w => (
                  <div key={w.id} style={{...styles.masterItem, ...(selectedWorker?.id === w.id ? styles.masterItemActive : {}), opacity: availableWorkers.includes(w) ? 1 : 0.6}} onClick={() => setSelectedWorker(w)}>
                    <div style={{...styles.masterAvatar, background: availableWorkers.includes(w) ? "#1976d2" : "#bbb"}}>{w.name.charAt(0)}</div>
                    <div style={styles.masterInfo}>
                      <div style={styles.masterNameRow}>
                        <span style={styles.masterName}>{w.fullName}</span>
                        {w.workerType === "trainee" && <span style={styles.traineeBadge}>技能実習生</span>}
                      </div>
                      <span style={styles.masterMeta}>{w.location} ・ {w.experience}年</span>
                    </div>
                    <span style={{...styles.statusDot, background: workerStatuses[w.status].color}}></span>
                  </div>
                ))}
              </div>
              <div style={styles.masterDetail}>
                {selectedWorker ? (
                  <>
                    <div style={styles.detailHeader}>
                      <div style={{...styles.detailAvatar, background: availableWorkers.includes(selectedWorker) ? "#1976d2" : "#bbb"}}>{selectedWorker.name.charAt(0)}</div>
                      <div>
                        <h2 style={styles.detailName}>{selectedWorker.fullName}</h2>
                        <p style={styles.detailMeta}>{selectedWorker.location} ・ 経験{selectedWorker.experience}年 {selectedWorker.workerType === "trainee" && "・ 技能実習生"}</p>
                      </div>
                    </div>
                    
                    {/* ステータス */}
                    <div style={styles.statusSection}>
                      <h3 style={styles.sectionTitle}>稼働状況</h3>
                      {editingWorkerStatus === selectedWorker.id ? (
                        <StatusEditor
                          statuses={workerStatuses}
                          current={selectedWorker}
                          onSave={(s, n, u) => updateWorkerStatus(selectedWorker.id, s, n, u)}
                          onCancel={() => setEditingWorkerStatus(null)}
                        />
                      ) : (
                        <div style={styles.statusDisplay}>
                          <span style={{...styles.statusBadgeLarge, background: workerStatuses[selectedWorker.status].bg, color: workerStatuses[selectedWorker.status].color}}>
                            {workerStatuses[selectedWorker.status].label}
                          </span>
                          {selectedWorker.statusNote && <span style={styles.statusNote}>{selectedWorker.statusNote}</span>}
                          {selectedWorker.unavailableUntil && <span style={styles.statusUntil}>〜 {selectedWorker.unavailableUntil}</span>}
                          <button onClick={() => setEditingWorkerStatus(selectedWorker.id)} style={styles.editBtn}>変更</button>
                        </div>
                      )}
                    </div>
                    
                    <div style={styles.detailSection}>
                      <h3 style={styles.sectionTitle}><Award size={16}/> 保有資格</h3>
                      <div style={styles.detailTags}>{selectedWorker.licenses.map((l,i) => <span key={i} style={styles.licenseTag}>{l}</span>)}</div>
                    </div>
                    <div style={styles.detailSection}>
                      <h3 style={styles.sectionTitle}><User size={16}/> スキル</h3>
                      <div style={styles.detailTags}>{selectedWorker.skills.map((s,i) => <span key={i} style={styles.skillTag}>{s}</span>)}</div>
                    </div>
                    <div style={styles.detailSection}>
                      <h3 style={styles.sectionTitle}>連絡先</h3>
                      <p>{selectedWorker.phone}</p>
                    </div>
                  </>
                ) : <div style={styles.detailEmpty}><User size={40} style={{color:"#ddd"}}/><p>作業員を選択</p></div>}
              </div>
            </div>
          )}

          {/* ===== 車両管理 ===== */}
          {activeTab === "vehicles" && (
            <div style={styles.vehicleLayout}>
              <div style={styles.vehicleGrid}>
                {vehicles.map(v => {
                  const used = sites.filter(s => s.vehicleId === v.id);
                  const isAvail = availableVehicles.includes(v);
                  const isSelected = selectedVehicle?.id === v.id;
                  return (
                    <div key={v.id} onClick={() => setSelectedVehicle(v)} style={{...styles.vehicleCard, borderColor: isSelected ? "#1976d2" : isAvail ? "#43a047" : "#e53935", background: isSelected ? "#e3f2fd" : isAvail ? "#f1f8e9" : "#ffebee", opacity: isAvail ? 1 : 0.7}}>
                      <Truck size={28} style={{color: isAvail ? "#43a047" : "#e53935"}} />
                      <span style={styles.vehicleId}>{v.id}</span>
                      <span style={styles.vehicleCap}>定員{v.capacity}名</span>
                      <span style={{...styles.vehicleStatus, color: vehicleStatuses[v.status].color}}>{vehicleStatuses[v.status].label}</span>
                      {used.length > 0 && <div style={styles.vehicleSites}>{used.map(s => <span key={s.id} style={styles.vehicleSiteTag}>{s.area}</span>)}</div>}
                    </div>
                  );
                })}
              </div>
              <div style={styles.vehicleDetail}>
                {selectedVehicle ? (
                  <>
                    <div style={styles.vDetailHeader}>
                      <Truck size={40} style={{color: availableVehicles.includes(selectedVehicle) ? "#43a047" : "#e53935"}}/>
                      <div>
                        <h2 style={styles.vDetailId}>{selectedVehicle.id}</h2>
                        <p>定員 {selectedVehicle.capacity}名</p>
                      </div>
                    </div>
                    <div style={styles.statusSection}>
                      <h3 style={styles.sectionTitle}>稼働状況</h3>
                      {editingVehicleStatus === selectedVehicle.id ? (
                        <StatusEditor
                          statuses={vehicleStatuses}
                          current={selectedVehicle}
                          onSave={(s, n, u) => updateVehicleStatus(selectedVehicle.id, s, n, u)}
                          onCancel={() => setEditingVehicleStatus(null)}
                        />
                      ) : (
                        <div style={styles.statusDisplay}>
                          <span style={{...styles.statusBadgeLarge, background: vehicleStatuses[selectedVehicle.status].bg, color: vehicleStatuses[selectedVehicle.status].color}}>
                            {vehicleStatuses[selectedVehicle.status].label}
                          </span>
                          {selectedVehicle.statusNote && <span style={styles.statusNote}>{selectedVehicle.statusNote}</span>}
                          {selectedVehicle.unavailableUntil && <span style={styles.statusUntil}>〜 {selectedVehicle.unavailableUntil}</span>}
                          <button onClick={() => setEditingVehicleStatus(selectedVehicle.id)} style={styles.editBtn}>変更</button>
                        </div>
                      )}
                    </div>
                  </>
                ) : <div style={styles.detailEmpty}><Truck size={40} style={{color:"#ddd"}}/><p>車両を選択</p></div>}
              </div>
            </div>
          )}
        </div>
      </main>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}

// ステータス編集コンポーネント
function StatusEditor({ statuses, current, onSave, onCancel }) {
  const [status, setStatus] = useState(current.status);
  const [note, setNote] = useState(current.statusNote);
  const [until, setUntil] = useState(current.unavailableUntil);
  return (
    <div style={editorStyles.container}>
      <div style={editorStyles.row}>
        <label>状態</label>
        <select value={status} onChange={e => setStatus(e.target.value)} style={editorStyles.select}>
          {Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      {status !== "available" && (
        <>
          <div style={editorStyles.row}>
            <label>理由</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="例: 夏季休暇" style={editorStyles.input}/>
          </div>
          <div style={editorStyles.row}>
            <label>復帰予定</label>
            <input type="date" value={until} onChange={e => setUntil(e.target.value)} style={editorStyles.input}/>
          </div>
        </>
      )}
      <div style={editorStyles.actions}>
        <button onClick={onCancel} style={editorStyles.cancelBtn}>キャンセル</button>
        <button onClick={() => onSave(status, status === "available" ? "" : note, status === "available" ? "" : until)} style={editorStyles.saveBtn}>保存</button>
      </div>
    </div>
  );
}

const editorStyles = {
  container: { background: "#f5f5f5", padding: "12px", borderRadius: "8px", marginTop: "8px" },
  row: { marginBottom: "10px" },
  select: { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", marginTop: "4px" },
  input: { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", marginTop: "4px" },
  actions: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" },
  cancelBtn: { padding: "8px 16px", border: "1px solid #ddd", background: "#fff", borderRadius: "6px", cursor: "pointer" },
  saveBtn: { padding: "8px 16px", border: "none", background: "#1976d2", color: "#fff", borderRadius: "6px", cursor: "pointer" },
};

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "'Hiragino Sans', sans-serif", background: "#f5f5f5", color: "#333" },
  sidebar: { width: "200px", background: "#fff", borderRight: "1px solid #e0e0e0", position: "fixed", height: "100vh" },
  logoArea: { padding: "20px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #eee" },
  logoMark: { width: "36px", height: "36px", background: "linear-gradient(135deg, #1976d2, #1565c0)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: "#fff" },
  logoText: { fontSize: "18px", fontWeight: "bold" },
  nav: { padding: "16px 10px", display: "flex", flexDirection: "column", gap: "4px" },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", border: "none", background: "transparent", borderRadius: "8px", fontSize: "14px", color: "#666", cursor: "pointer", textAlign: "left", position: "relative" },
  navItemActive: { background: "#e3f2fd", color: "#1976d2", fontWeight: "600" },
  navBadge: { position: "absolute", right: "10px", background: "#e53935", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px" },
  main: { flex: 1, marginLeft: "200px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "#fff", borderBottom: "1px solid #e0e0e0" },
  headerLeft: { display: "flex", alignItems: "center", gap: "20px" },
  pageTitle: { fontSize: "18px", fontWeight: "bold" },
  dateNav: { display: "flex", alignItems: "center", gap: "8px" },
  dateBtn: { padding: "6px 8px", border: "1px solid #ddd", background: "#fff", borderRadius: "6px", cursor: "pointer" },
  dateText: { fontSize: "14px", fontWeight: "600", minWidth: "160px", textAlign: "center" },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
  headerStats: { display: "flex", gap: "16px", fontSize: "13px", color: "#666" },
  headerStat: { display: "flex", gap: "4px" },
  headerStatAlert: { display: "flex", alignItems: "center", gap: "4px", color: "#e53935", fontWeight: "600" },
  resetBtn: { display: "flex", alignItems: "center", gap: "4px", padding: "8px 12px", border: "1px solid #ddd", background: "#fff", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  autoBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", background: "linear-gradient(135deg, #1976d2, #1565c0)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  content: { padding: "16px 20px", height: "calc(100vh - 60px)", overflow: "auto" },
  // 配置表
  assignmentLayout: { display: "flex", gap: "16px", height: "100%" },
  slotColumns: { flex: 1, display: "flex", gap: "12px" },
  slotColumn: { flex: 1, display: "flex", flexDirection: "column", minWidth: "240px" },
  slotHeader: { padding: "10px 14px", borderRadius: "8px 8px 0 0", borderBottom: "3px solid", display: "flex", justifyContent: "space-between" },
  slotLabel: { fontSize: "14px", fontWeight: "700" },
  slotCount: { fontSize: "12px", color: "#666" },
  slotCards: { flex: 1, overflow: "auto", padding: "8px 0", display: "flex", flexDirection: "column", gap: "10px" },
  siteCard: { background: "#fff", borderRadius: "8px", borderLeft: "4px solid", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", padding: "12px" },
  siteCardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  siteClient: { fontSize: "11px", color: "#888" },
  siteTime: { fontSize: "11px", color: "#666", fontWeight: "500" },
  siteName: { fontSize: "14px", fontWeight: "600", marginBottom: "4px" },
  siteMeta: { display: "flex", gap: "6px", fontSize: "11px", color: "#666", marginBottom: "10px" },
  siteWorkers: { position: "relative" },
  workerHeader: { display: "flex", gap: "6px", marginBottom: "6px", fontSize: "12px", fontWeight: "600" },
  shortBadge: { padding: "2px 6px", background: "#ffebee", borderRadius: "4px", fontSize: "10px", color: "#e53935" },
  workerChips: { display: "flex", flexWrap: "wrap", gap: "4px" },
  workerChip: { display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "#e3f2fd", borderRadius: "12px", fontSize: "11px", fontWeight: "500", cursor: "grab" },
  removeBtn: { background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "12px" },
  addBtn: { padding: "4px 10px", background: "#fff", border: "1px dashed #bbb", borderRadius: "12px", fontSize: "11px", cursor: "pointer" },
  picker: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ddd", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, maxHeight: "150px", overflow: "auto" },
  pickerItem: { display: "flex", justifyContent: "space-between", padding: "8px 10px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", fontSize: "12px" },
  pickerEmpty: { padding: "12px", textAlign: "center", fontSize: "11px", color: "#888" },
  traineeBadge: { padding: "2px 6px", background: "#f3e5f5", borderRadius: "4px", fontSize: "9px", color: "#7b1fa2" },
  siteVehicle: { display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #eee" },
  vehicleSelect: { flex: 1, padding: "4px 8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "11px" },
  // 右パネル
  rightPanel: { width: "220px", display: "flex", flexDirection: "column", gap: "12px" },
  logPanel: { background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", maxHeight: "200px", overflow: "hidden" },
  logHeader: { padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: "12px", fontWeight: "600" },
  logContent: { padding: "10px", overflow: "auto", maxHeight: "150px", fontSize: "10px", fontFamily: "monospace", lineHeight: "1.6" },
  unavailablePanel: { background: "#fff", borderRadius: "8px", border: "1px solid #ffcdd2", padding: "10px" },
  unavailableHeader: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#e53935", marginBottom: "8px" },
  unavailableItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: "12px" },
  statusBadge: { padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "600" },
  workerPanel: { flex: 1, background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" },
  panelHeader: { padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: "12px", fontWeight: "600" },
  workerList: { padding: "8px", overflow: "auto", maxHeight: "300px" },
  workerRow: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", borderRadius: "4px", marginBottom: "2px", cursor: "grab" },
  workerRowName: { flex: 1, fontSize: "12px", fontWeight: "500" },
  traineeMark: { padding: "1px 4px", background: "#f3e5f5", borderRadius: "4px", fontSize: "9px", color: "#7b1fa2" },
  workerSlots: { display: "flex", gap: "2px" },
  slotTag: { padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "600" },
  offTag: { padding: "2px 6px", background: "#f5f5f5", borderRadius: "4px", fontSize: "10px", color: "#999" },
  // タイムライン
  timelineCard: { background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  timelineWrapper: { padding: "16px" },
  timelineHeader: { display: "flex", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "4px" },
  timelineWorkerCol: { width: "120px", display: "flex", alignItems: "center", gap: "8px", fontSize: "11px" },
  timelineHours: { flex: 1, display: "flex" },
  timelineHour: { flex: 1, fontSize: "10px", color: "#999", textAlign: "center" },
  timelineRow: { display: "flex", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #f5f5f5" },
  timelineAvatar: { width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "600", color: "#fff" },
  timelineWorkerName: { fontSize: "11px", fontWeight: "500" },
  timelineStatus: { fontSize: "9px", color: "#e53935", display: "block" },
  timelineBar: { flex: 1, height: "28px", background: "#f5f5f5", borderRadius: "4px", position: "relative" },
  timelineBlock: { position: "absolute", top: "4px", height: "20px", borderRadius: "4px", border: "1px solid", padding: "2px 6px", overflow: "hidden" },
  timelineBlockText: { fontSize: "9px", fontWeight: "600" },
  timelineOff: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: "10px", color: "#bbb" },
  timelineUnavailable: { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: "#e53935" },
  // マスタ
  masterLayout: { display: "flex", gap: "16px", height: "calc(100vh - 120px)" },
  masterList: { width: "300px", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "auto", padding: "8px" },
  masterItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "6px", cursor: "pointer", marginBottom: "4px" },
  masterItemActive: { background: "#e3f2fd" },
  masterAvatar: { width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "#fff" },
  masterInfo: { flex: 1 },
  masterNameRow: { display: "flex", alignItems: "center", gap: "6px" },
  masterName: { fontSize: "13px", fontWeight: "600" },
  masterMeta: { fontSize: "11px", color: "#888" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%" },
  masterDetail: { flex: 1, background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", padding: "20px", overflow: "auto" },
  detailHeader: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #eee" },
  detailAvatar: { width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "600", color: "#fff" },
  detailName: { fontSize: "20px", fontWeight: "bold", marginBottom: "4px" },
  detailMeta: { fontSize: "13px", color: "#666" },
  statusSection: { marginBottom: "20px", padding: "16px", background: "#fafafa", borderRadius: "8px" },
  sectionTitle: { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", marginBottom: "10px" },
  statusDisplay: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  statusBadgeLarge: { padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "600" },
  statusNote: { fontSize: "13px", color: "#666" },
  statusUntil: { fontSize: "13px", color: "#888" },
  editBtn: { padding: "6px 12px", border: "1px solid #ddd", background: "#fff", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginLeft: "auto" },
  detailSection: { marginBottom: "20px" },
  detailTags: { display: "flex", flexWrap: "wrap", gap: "6px" },
  licenseTag: { padding: "6px 12px", background: "#e3f2fd", borderRadius: "6px", fontSize: "12px", fontWeight: "500", color: "#1565c0" },
  skillTag: { padding: "6px 12px", background: "#fff3e0", borderRadius: "6px", fontSize: "12px", fontWeight: "500", color: "#e65100" },
  detailEmpty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px", color: "#bbb", fontSize: "13px" },
  // 車両
  vehicleLayout: { display: "flex", gap: "16px", height: "calc(100vh - 120px)" },
  vehicleGrid: { flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", alignContent: "start" },
  vehicleCard: { padding: "16px", borderRadius: "8px", border: "2px solid", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer" },
  vehicleId: { fontSize: "22px", fontWeight: "bold" },
  vehicleCap: { fontSize: "11px", color: "#888" },
  vehicleStatus: { fontSize: "11px", fontWeight: "600" },
  vehicleSites: { display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap", justifyContent: "center" },
  vehicleSiteTag: { padding: "3px 6px", background: "#e8f5e9", borderRadius: "4px", fontSize: "10px", color: "#2e7d32" },
  vehicleDetail: { width: "300px", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", padding: "20px" },
  vDetailHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #eee" },
  vDetailId: { fontSize: "28px", fontWeight: "bold" },
};
