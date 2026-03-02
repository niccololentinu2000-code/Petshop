(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const f={data:"https://doloris-unrecalcitrant-vanna.ngrok-free.dev/webhook/petshop-data",feed:"https://doloris-unrecalcitrant-vanna.ngrok-free.dev/webhook/petshop-feed"},c={headers:{"ngrok-skip-browser-warning":"true"}};async function m(){const e=await fetch(f.data,c);if(!e.ok)throw new Error(`HTTP Error ${e.status}`);return await e.json()}async function v(e){if(!(await fetch(f.feed,{...c,method:"POST",headers:{...c.headers,"Content-Type":"application/json"},body:JSON.stringify({id:e})})).ok)throw new Error("Feed failed");return!0}const d={state:{animals:[],inventory:[],isConnected:!1,lastUpdate:null},listeners:[],setState(e){this.state={...this.state,...e},this.notify()},subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}},notify(){this.listeners.forEach(e=>e(this.state))}},u={dog:"🐕",cat:"🐈",fish:"🐟",bird:"🐦",rabbit:"🐇",default:"🐾"};function y(e,t){const s=e.health_score||0,r=e.species?e.species.toLowerCase():"default",n=u[r]||u.default,o=s>50,a=document.createElement("div");a.className="animal-card",a.innerHTML=`
    <div class="animal-header">
      <div class="animal-icon">${n}</div>
      <div class="animal-info">
        <h3>${e.name}</h3>
        <span>${e.species||"Sconosciuto"}</span>
      </div>
    </div>
    <div class="health-section">
      <div class="health-meta">
        <span style="color: var(--text-dim)">Salute</span>
        <span style="font-weight: 700; color: ${o?"var(--success)":"var(--danger)"}">${s}%</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${s}%; background: ${o?"var(--success)":"var(--danger)"}"></div>
      </div>
    </div>
    <button class="btn-feed">NUTRI 🍖</button>
  `;const i=a.querySelector(".btn-feed");return i.onclick=async()=>{const h=i.textContent;i.disabled=!0,i.textContent="... 🍖";try{await v(e.id),t("Animale nutrito con successo!","success"),i.textContent="FATTO! ✨",setTimeout(()=>{window.dispatchEvent(new CustomEvent("refresh-data"))},1500)}catch{t("Errore durante il pasto.","error"),i.disabled=!1,i.textContent=h}},a}function p(e,t="info"){const s=document.getElementById("toast-container");if(!s)return;const r=document.createElement("div");r.className="toast";const n=t==="success"?"✅":t==="error"?"❌":"ℹ️";r.innerHTML=`
    <span class="toast-icon">${n}</span>
    <span class="toast-message">${e}</span>
  `,s.appendChild(r),setTimeout(()=>{r.style.opacity="0",r.style.transform="translateX(20px)",setTimeout(()=>r.remove(),300)},3e3)}function g(e){const t=document.getElementById("status-dot"),s=document.getElementById("conn-text");!t||!s||(t.style.background=e?"var(--success)":"var(--danger)",t.style.boxShadow=e?"0 0 10px var(--success)":"0 0 10px var(--danger)",s.textContent=e?"CONNESSO":"ERRORE CONNESSIONE")}function b(e){const t=document.getElementById("animal-grid");if(t){if(!e||e.length===0){t.innerHTML='<p style="color: var(--text-dim)">Nessun animale trovato.</p>';return}t.innerHTML="",e.forEach(s=>{t.appendChild(y(s,p))})}}function E(e){const t=document.getElementById("inventory-list");if(t){if(!e||e.length===0){t.innerHTML='<p style="color: var(--text-dim)">Magazzino vuoto.</p>';return}t.innerHTML=e.map(s=>{const r=(s.quantity||0)<=5;return`
      <div class="inventory-item">
        <div class="item-info">
          <p>${s.item_name}</p>
          <span class="item-stock">Disponibili: ${s.quantity}</span>
        </div>
        <span class="stock-level ${r?"low":"ok"}">${r?"SCARSO":"OTTIMO"}</span>
      </div>
    `}).join("")}}async function l(){try{const e=await m();d.setState({animals:e.animals||[],inventory:e.inventory||[],isConnected:!0,lastUpdate:new Date})}catch(e){console.error("Fetch error:",e),d.setState({isConnected:!1}),p("Errore nel recupero dati. Riprovo...","error")}}d.subscribe(e=>{b(e.animals),E(e.inventory),g(e.isConnected)});window.addEventListener("refresh-data",l);document.addEventListener("DOMContentLoaded",()=>{l(),setInterval(l,1e4)});
