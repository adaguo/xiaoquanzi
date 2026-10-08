import {ApplicationInsights} from '@microsoft/applicationinsights-web';
import connectionString from './connection.json';
const events=new Set(['site_visit','board_enter','board_created','module_view','module_action','module_success']);
let context={board:'',role:''}, visitor='';
try {visitor=localStorage.getItem('xqz_metrics_visitor');if(!/^[a-f0-9-]{36}$/i.test(visitor||'')){visitor=crypto.randomUUID();localStorage.setItem('xqz_metrics_visitor',visitor)}}catch{visitor=crypto.randomUUID()}
const ai=new ApplicationInsights({config:{connectionString,disableCookiesUsage:true,disableStorageUsage:true,disableAjaxTracking:true,disableFetchTracking:true,disableExceptionTracking:true,enableAutoRouteTracking:false,autoTrackPageVisitTime:false,samplingPercentage:100,maxBatchInterval:15000}});
ai.loadAppInsights();
ai.addTelemetryInitializer(item=>{if(item.baseType!=='EventData'||!events.has(item.baseData?.name))return false;item.tags={};item.ext={};const p={...item.baseData.properties,...item.data};item.data={};item.baseData.properties={visitor,board:/^[a-zA-Z0-9]{4,16}$/.test(p.board||context.board)?p.board||context.board:'',role:['owner','member'].includes(p.role||context.role)?p.role||context.role:'',module:['board','wish','vote','drink','fund'].includes(p.module)?p.module:'',action:['publish','claim','vote','contribute','edit'].includes(p.action)?p.action:''};item.baseData.measurements={};});
function track(name,props={}){try{if(events.has(name))ai.trackEvent({name},props)}catch{}}
const sections={gathering:'board',thursday:'board',wishBoard:'wish',rankZone:'vote',drinksSection:'drink',drinks:'drink',fundSection:'fund'};
let observer,seen=new Set();
window.XQMetrics={track,enter(board,role){context={board,role:role==='host'||role===true?'owner':'member'};track('board_enter');seen=new Set();observer?.disconnect();observer=new IntersectionObserver(entries=>{for(const e of entries){const module=sections[e.target.id];if(e.isIntersecting&&e.intersectionRatio>0&&!seen.has(module)){seen.add(module);track('module_view',{module})}}},{threshold:0});requestAnimationFrame(()=>Object.keys(sections).forEach(id=>{let el=document.getElementById(id);if(el)observer.observe(el)}));}};
track('site_visit');
document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled||!context.board)return;const module=el.matches('.bb-vote')?'vote':el.closest('#wishBoard')?'wish':el.closest('#rankZone')?'vote':el.closest('#fundSection')?'fund':el.closest('#drinksSection,#drinks')?'drink':el.closest('#gathering,#thursday')?'board':'';if(!module)return;let action=el.matches('.bb-vote')?'vote':el.id==='wishOpenBtn'||el.id==='doOpenBtn'?'publish':el.closest('#wishBoard')?'claim':'edit';track('module_action',{module,action});});
