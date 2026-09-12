// --- APP STATE & INITIALIZATION ---
let allRanks = [];
let currentFilter = 'all';
let currentSearch = '';
let activeView = 'cards';

// Block names mapping for Minecraft assets CDN
const KNOWN_BLOCKS = new Set([
  'beacon', 'bookshelf', 'cobblestone', 'diamond_block', 'emerald_block', 'gold_block',
  'grass_block', 'iron_block', 'netherite_block', 'oak_log', 'obsidian', 'spruce_log',
  'stone', 'deepslate', 'furnace', 'crafting_table', 'spawner', 'glass', 'dirt',
  'slime_block', 'sponge', 'crying_obsidian', 'ancient_debris', 'tnt', 'respawn_anchor'
]);

// Custom item name rewrites
const MATERIAL_MAP = {
  'vanillaitem': null,
  'grass_block': 'grass_block_top',
  'oak_log': 'oak_log_top',
  'spruce_log': 'spruce_log_top',
  'moneda_cobre': 'copper_ingot',
  'moneda_oro': 'gold_nugget',
  'moneda_diamante': 'diamond',
  'moneda_netherite': 'netherite_scrap'
};

// Item Tooltip Database for Special Sets and items
const SPECIAL_ITEMS_TOOLTIPS = {
  'SenorDiamante_helmet': {
    name: '&b✦ Corona de Diamante Abisal',
    lore: '&7Forjada con diamantes puros del vacío.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending'
  },
  'SenorDiamante_chestplate': {
    name: '&b✦ Coraza de Diamante Abisal',
    lore: '&7Forjada con diamantes puros del vacío.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending'
  },
  'SenorDiamante_leggings': {
    name: '&b✦ Grebas de Diamante Abisal',
    lore: '&7Forjada con diamantes puros del vacío.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending'
  },
  'SenorDiamante_boots': {
    name: '&b✦ Pisadas de Diamante Abisal',
    lore: '&7Forjada con diamantes puros del vacío.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending'
  },
  'SenorDiamante_weapon': {
    name: '&b✦ Arco del Señor del Diamante',
    lore: '&7Dispara flechas con daño incrementado.\n&b+15% Daño con Proyectiles\n&9Power V, Punch II, Flame, Infinity'
  },
  'TitanAbismo_helmet': {
    name: '&8✦ Yelmo del Titán Sombrío',
    lore: '&7Imbuido con almas perdidas del abismo.\n&c+4 Corazones Máximos\n&9Protection V, Unbreaking IV, Overload III'
  },
  'TitanAbismo_chestplate': {
    name: '&8✦ Pectoral de Ecos Abisales',
    lore: '&7Imbuido con almas perdidas del abismo.\n&c-20% Daño Recibido (Tanque)\n&9Protection V, Unbreaking IV, Angelic IV'
  },
  'TitanAbismo_leggings': {
    name: '&8✦ Grebas de Netherite Oscura',
    lore: '&7Imbuido con almas perdidas del abismo.\n&c+35% Daño Criaturas\n&9Protection V, Unbreaking IV, Heavy IV'
  },
  'TitanAbismo_boots': {
    name: '&8✦ Pisadas del Cataclismo',
    lore: '&7Imbuido con almas perdidas del abismo.\n&aInmunidad a Caída y Fuego\n&9Protection V, Unbreaking IV, Gears III'
  },
  'TitanAbismo_weapon': {
    name: '&8✦ Filo del Titán Abisal',
    lore: '&7Espada masiva de netherite pura.\n&c+20% Daño Cuerpo a Cuerpo\n&4Robo de Vida Vampírico & Desangrado\n&9Sharpness VI, DemonicLifesteal IV'
  },
  'DeidadOneBlock_helmet': {
    name: '&d✧ Corona de la Deidad',
    lore: '&7Forjada con netherite celestial del OneBlock.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending, Tank IV'
  },
  'DeidadOneBlock_chestplate': {
    name: '&d✧ Coraza de la Deidad',
    lore: '&7Forjada con netherite celestial del OneBlock.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending, Angelic III'
  },
  'DeidadOneBlock_leggings': {
    name: '&d✧ Grebas de la Deidad',
    lore: '&7Forjada con netherite celestial del OneBlock.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending, Armored IV'
  },
  'DeidadOneBlock_boots': {
    name: '&d✧ Botas de la Deidad',
    lore: '&7Forjada con netherite celestial del OneBlock.\n&c+2 Corazones Máximos de Vida\n&9Protection V, Unbreaking IV, Mending, Gears II'
  },
  'DeidadOneBlock_weapon': {
    name: '&d✧ Hacha de la Deidad',
    lore: '&7Un hacha de combate devastadora y balanceada.\n&c+20% Daño en Combate\n&aAtaque en Área (Cleave III)\n&4Robo de Vida Moderado\n&9Sharpness VI, Unbreaking IV, Mending'
  },
  'moneda_cobre': {
    name: '&6🪙 Moneda de Cobre',
    lore: '&7Moneda básica de la isla.\n&eRecompensa diaria y de ascenso.\n&8Uso: Economía de isla y mejoras básicas.'
  },
  'moneda_oro': {
    name: '&e🪙 Moneda de Oro',
    lore: '&7Moneda comercial de la isla.\n&eObtenible a partir de la Era II.\n&8Uso: Mercaderes y comercio avanzado.'
  },
  'moneda_diamante': {
    name: '&b🪙 Moneda de Diamante',
    lore: '&7Moneda élite de la isla.\n&eObtenible a partir de la Era III.\n&8Uso: Recursos legendarios y llaves.'
  },
  'moneda_netherite': {
    name: '&5🪙 Moneda de Netherita',
    lore: '&7Moneda mítica suprema de la isla.\n&dExclusiva de los rangos superiores (Era IV).\n&8Uso: Acceso a las mayores recompensas de OneBlock.'
  }
};

// --- MINECRAFT ASSETS RESOLVER ---
function getMinecraftAssetUrl(material) {
  if (!material) return 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21/assets/minecraft/textures/item/barrier.png';
  
  let clean = material.toLowerCase().replace('minecraft:', '').trim();
  if (MATERIAL_MAP[clean]) {
    clean = MATERIAL_MAP[clean];
  }

  // Common special names
  if (clean.includes('log')) clean = 'oak_log_top';
  if (clean === 'exp' || clean === 'experience_bottle') clean = 'experience_bottle';
  if (clean === 'money') clean = 'gold_ingot';

  const isBlock = KNOWN_BLOCKS.has(clean) || clean.endsWith('_block') || clean.endsWith('_ore') || clean.includes('planks') || clean.includes('log');
  const folder = isBlock ? 'block' : 'item';
  
  return `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21/assets/minecraft/textures/${folder}/${clean}.png`;
}

function handleImgError(img) {
  const src = img.src;
  if (src.includes('/item/')) {
    img.src = src.replace('/item/', '/block/');
  } else if (src.includes('/block/')) {
    img.src = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21/assets/minecraft/textures/item/barrier.png';
  }
}

// --- MINECRAFT COLOR CODES PARSER ---
function formatMcColors(text) {
  if (!text) return '';
  
  const COLOR_MAP = {
    '0': 'mc-c-0', '1': 'mc-c-1', '2': 'mc-c-2', '3': 'mc-c-3',
    '4': 'mc-c-4', '5': 'mc-c-5', '6': 'mc-c-6', '7': 'mc-c-7',
    '8': 'mc-c-8', '9': 'mc-c-9', 'a': 'mc-c-a', 'b': 'mc-c-b',
    'c': 'mc-c-c', 'd': 'mc-c-d', 'e': 'mc-c-e', 'f': 'mc-c-f'
  };

  const FORMAT_MAP = {
    'l': 'mc-bold',
    'o': 'mc-italic',
    'n': 'mc-underline',
    'm': 'mc-strikethrough'
  };

  let formatted = '';
  let activeClasses = [];
  
  const tokens = text.split('&');
  formatted += tokens[0]; // Text before any &
  
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    
    const code = token[0].toLowerCase();
    const content = token.slice(1);
    
    if (COLOR_MAP[code]) {
      activeClasses = [COLOR_MAP[code]];
      formatted += `<span class="${activeClasses.join(' ')}">${content}</span>`;
    } else if (FORMAT_MAP[code]) {
      if (!activeClasses.includes(FORMAT_MAP[code])) {
        activeClasses.push(FORMAT_MAP[code]);
      }
      formatted += `<span class="${activeClasses.join(' ')}">${content}</span>`;
    } else if (code === 'r') {
      activeClasses = [];
      formatted += content;
    } else {
      formatted += '&' + token;
    }
  }
  
  return formatted;
}

// Format numbers nicely: 50000 -> 50,000
function formatNumber(num) {
  return new Intl.NumberFormat('es-MX').format(num);
}

// --- RENDER FUNCTIONS ---
function renderCards(ranks) {
  const container = document.getElementById('ranksGrid');
  container.innerHTML = '';

  if (ranks.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
      <p class="mc-font" style="font-size: 24px;">No se encontraron rangos con el filtro actual.</p>
    </div>`;
    return;
  }

  ranks.forEach(rank => {
    const card = document.createElement('div');
    card.className = 'rank-card';
    card.id = `rank-${rank.weight}`;

    // Extract Island Level Requirement
    const levelCond = rank.requirements.conditions.find(c => c.expression.includes('superior_island_level'));
    const levelLabel = levelCond ? levelCond.label : 'Nivel de Isla Requerido';

    // Extract Extra Conditions (Bosses, communal skills, mob kills)
    const extraConds = rank.requirements.conditions.filter(c => 
      !c.expression.includes('superior_island_level')
    );

    // Special items / sets
    const specialSet = rank.rewards.unique?.specialSet;
    const setKey = rank.weight === 10 ? 'SenorDiamante' : (rank.weight === 20 ? 'TitanAbismo' : 'DeidadOneBlock');
    const weaponIcon = rank.weight === 10 ? 'bow' : (rank.weight === 20 ? 'netherite_sword' : 'netherite_axe');

    const COIN_META = {
      cobre: { name: 'Cobre', mat: 'moneda_cobre', class: 'coin-cobre' },
      oro: { name: 'Oro', mat: 'moneda_oro', class: 'coin-oro' },
      diamante: { name: 'Diamante', mat: 'moneda_diamante', class: 'coin-diamante' },
      netherite: { name: 'Netherita', mat: 'moneda_netherite', class: 'coin-netherite' }
    };

    const dailyCoinsEntries = Object.entries(rank.coins?.daily || {});
    const uniqueCoinsEntries = Object.entries(rank.coins?.unique || {});

    card.innerHTML = `
      <!-- Header -->
      <div class="card-header">
        <div class="rank-title-group">
          <span class="rank-badge">#${rank.weight}</span>
          <span class="rank-name">${formatMcColors(rank.colorName)}</span>
        </div>
        <span class="era-tag">${rank.era}</span>
      </div>

      <div class="card-body">
        <!-- Requisitos -->
        <div class="requirements-box">
          <div class="section-title">
            <img src="https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21/assets/minecraft/textures/item/book.png" class="mc-pixelated" alt="Req">
            Requisitos de Ascenso
          </div>

          <!-- Requirement chips -->
          <div class="req-chips-grid">
            <div class="req-chip" onmouseenter="showTooltip(event, 'Nivel de Isla', '${levelLabel}')" onmouseleave="hideTooltip()">
              <img src="${getMinecraftAssetUrl('BEACON')}" onerror="handleImgError(this)" class="mc-pixelated" alt="Level">
              <div>
                <span class="chip-label">Nivel de Isla</span>
                <span class="chip-val">${levelLabel.replace('Nivel de Isla ', '')}</span>
              </div>
            </div>

            <div class="req-chip">
              <img src="${getMinecraftAssetUrl('GOLD_INGOT')}" onerror="handleImgError(this)" class="mc-pixelated" alt="Money">
              <div>
                <span class="chip-label">Dinero</span>
                <span class="chip-val" style="color: var(--mc-yellow);">$${formatNumber(rank.requirements.money)}</span>
              </div>
            </div>

            <div class="req-chip">
              <img src="${getMinecraftAssetUrl('EXPERIENCE_BOTTLE')}" onerror="handleImgError(this)" class="mc-pixelated" alt="XP">
              <div>
                <span class="chip-label">Experiencia</span>
                <span class="chip-val" style="color: var(--mc-c-a);">${rank.requirements.xp} Niveles</span>
              </div>
            </div>

            ${extraConds.map(c => `
              <div class="req-chip" onmouseenter="showTooltip(event, '${c.label}', 'Requisito especial de ascenso')" onmouseleave="hideTooltip()">
                <img src="${getMinecraftAssetUrl(c.icon)}" onerror="handleImgError(this)" class="mc-pixelated" alt="Cond">
                <div>
                  <span class="chip-label">Desafío</span>
                  <span class="chip-val" style="color: var(--mc-c-b);">${c.label}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Items required slots -->
          ${rank.requirements.items.length > 0 ? `
            <div style="font-size: 11px; color: #888; margin-bottom: 4px; font-weight: 600;">ÍTEMS REQUERIDOS:</div>
            <div class="mc-slots-grid">
              ${rank.requirements.items.map(item => `
                <div class="mc-slot" onmouseenter="showTooltip(event, '${item.material.replace(/_/g, ' ')}', 'Cantidad requerida: ${item.amount}')" onmouseleave="hideTooltip()">
                  <img src="${getMinecraftAssetUrl(item.material)}" onerror="handleImgError(this)" class="mc-pixelated" alt="${item.material}">
                  <span class="item-count">${item.amount}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Monedas de Isla (Economía) -->
        <div class="coins-reward-box">
          <div class="coins-section-header">
            <img src="${getMinecraftAssetUrl('moneda_oro')}" class="mc-pixelated" alt="Monedas">
            <span>MONEDAS DE ISLA</span>
          </div>
          <div class="coins-groups">
            <div class="coins-subgroup">
              <span class="coins-subgroup-title">Diarias:</span>
              <div class="coins-chips-row">
                ${dailyCoinsEntries.map(([type, amt]) => `
                  <div class="coin-chip ${COIN_META[type]?.class || ''}" onmouseenter="showSpecialTooltip(event, 'moneda_${type}')" onmouseleave="hideTooltip()">
                    <img src="${getMinecraftAssetUrl(COIN_META[type]?.mat)}" class="mc-pixelated" alt="${type}">
                    <span class="coin-amount">${amt}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="coins-subgroup">
              <span class="coins-subgroup-title">Al Ascender (1x):</span>
              <div class="coins-chips-row">
                ${uniqueCoinsEntries.map(([type, amt]) => `
                  <div class="coin-chip ${COIN_META[type]?.class || ''} unique-coin" onmouseenter="showSpecialTooltip(event, 'moneda_${type}')" onmouseleave="hideTooltip()">
                    <img src="${getMinecraftAssetUrl(COIN_META[type]?.mat)}" class="mc-pixelated" alt="${type}">
                    <span class="coin-amount">+${amt}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Bonos de Isla -->
        ${Object.keys(rank.islandBonuses).length > 0 ? `
          <div class="bonuses-row">
            ${rank.islandBonuses['crop-growth'] ? `<span class="bonus-pill">🌾 Cultivos: x${rank.islandBonuses['crop-growth']}</span>` : ''}
            ${rank.islandBonuses['spawner-rates'] ? `<span class="bonus-pill">⚡ Spawners: x${rank.islandBonuses['spawner-rates']}</span>` : ''}
            ${rank.islandBonuses['mob-drops'] ? `<span class="bonus-pill">⚔️ Drops: x${rank.islandBonuses['mob-drops']}</span>` : ''}
            ${rank.islandBonuses['team-limit'] ? `<span class="bonus-pill">👥 Equipo: ${rank.islandBonuses['team-limit']}</span>` : ''}
            ${rank.islandBonuses['warps-limit'] ? `<span class="bonus-pill">📍 Warps: ${rank.islandBonuses['warps-limit']}</span>` : ''}
          </div>
        ` : ''}

        <!-- Recompensa Única -->
        <div class="unique-reward-box">
          <div class="unique-header">
            <img src="${getMinecraftAssetUrl('NETHER_STAR')}" class="mc-pixelated" alt="Unique">
            <span>RECOMPENSA ÚNICA (1x)</span>
          </div>

          <!-- Special Set Display (Rank 10, 20, 30) -->
          ${specialSet ? `
            <div class="special-set-badge">
              <div class="set-badge-title">
                <span>🛡️ ${specialSet.name} + Arma</span>
              </div>
              <div class="set-pieces-slots">
                <div class="mc-slot" onmouseenter="showSpecialTooltip(event, '${setKey}_helmet')" onmouseleave="hideTooltip()">
                  <img src="${getMinecraftAssetUrl('netherite_helmet')}" class="mc-pixelated" alt="Helmet">
                </div>
                <div class="mc-slot" onmouseenter="showSpecialTooltip(event, '${setKey}_chestplate')" onmouseleave="hideTooltip()">
                  <img src="${getMinecraftAssetUrl('netherite_chestplate')}" class="mc-pixelated" alt="Chestplate">
                </div>
                <div class="mc-slot" onmouseenter="showSpecialTooltip(event, '${setKey}_leggings')" onmouseleave="hideTooltip()">
                  <img src="${getMinecraftAssetUrl('netherite_leggings')}" class="mc-pixelated" alt="Leggings">
                </div>
                <div class="mc-slot" onmouseenter="showSpecialTooltip(event, '${setKey}_boots')" onmouseleave="hideTooltip()">
                  <img src="${getMinecraftAssetUrl('netherite_boots')}" class="mc-pixelated" alt="Boots">
                </div>
                <div class="mc-slot" style="margin-left: 6px; background-color: #553311;" onmouseenter="showSpecialTooltip(event, '${setKey}_weapon')" onmouseleave="hideTooltip()">
                  <img src="${getMinecraftAssetUrl(weaponIcon)}" class="mc-pixelated" alt="Weapon">
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Text Beneficies -->
          <ul class="unique-desc-list" style="margin-top: 10px;">
            ${rank.rewards.unique.beneficies.map(b => `
              <li>${formatMcColors(b)}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderTable(ranks) {
  const tbody = document.getElementById('ranksTableBody');
  tbody.innerHTML = '';

  ranks.forEach(rank => {
    const tr = document.createElement('tr');

    const levelCond = rank.requirements.conditions.find(c => c.expression.includes('superior_island_level'));
    const levelLabel = levelCond ? levelCond.label.replace('Nivel de Isla ', '') : '-';

    const itemsSummary = rank.requirements.items.map(i => `${i.amount}x ${i.material.replace(/_/g, ' ')}`).join(', ') || 'Ninguno';

    const uniqueSummary = rank.rewards.unique.beneficies.length > 0
      ? rank.rewards.unique.beneficies[0]
      : 'Recompensa estándar';

    tr.innerHTML = `
      <td><strong>#${rank.weight}</strong></td>
      <td><strong>${formatMcColors(rank.colorName)}</strong></td>
      <td>${levelLabel}</td>
      <td style="color: var(--mc-yellow); font-weight: bold;">$${formatNumber(rank.requirements.money)}</td>
      <td style="color: var(--mc-c-a); font-weight: bold;">${rank.requirements.xp} L</td>
      <td style="max-width: 250px; font-size: 11px;">${itemsSummary}</td>
      <td style="max-width: 350px;">${formatMcColors(uniqueSummary)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- FILTER & SEARCH HANDLER ---
function applyFilters() {
  let filtered = allRanks.filter(rank => {
    // Era Filter
    if (currentFilter !== 'all') {
      const eraNum = parseInt(currentFilter, 10);
      if (rank.eraId !== eraNum) return false;
    }

    // Search Filter
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      const matchName = rank.name.toLowerCase().includes(q);
      const matchKey = rank.key.toLowerCase().includes(q);
      const matchItems = rank.requirements.items.some(i => i.material.toLowerCase().includes(q));
      const matchConds = rank.requirements.conditions.some(c => c.label.toLowerCase().includes(q));
      const matchCoins = (rank.coins?.daily && Object.keys(rank.coins.daily).some(k => k.includes(q))) ||
                         (rank.coins?.unique && Object.keys(rank.coins.unique).some(k => k.includes(q))) ||
                         (['moneda', 'monedas', 'cobre', 'oro', 'diamante', 'netherita', 'netherite'].some(k => k.includes(q)));
      const matchBeneficies = rank.rewards.unique?.beneficies && rank.rewards.unique.beneficies.some(b => b.toLowerCase().includes(q));
      if (!matchName && !matchKey && !matchItems && !matchConds && !matchCoins && !matchBeneficies) return false;
    }

    return true;
  });

  document.getElementById('ranksCount').innerText = `Mostrando ${filtered.length} de ${allRanks.length} rangos`;
  renderCards(filtered);
  renderTable(filtered);
}

// --- TOOLTIP LOGIC ---
const tooltipEl = document.getElementById('mcTooltip');
const tooltipTitleEl = document.getElementById('tooltipTitle');
const tooltipLoreEl = document.getElementById('tooltipLore');

function showTooltip(event, title, lore) {
  tooltipTitleEl.innerHTML = formatMcColors(title);
  tooltipLoreEl.innerHTML = formatMcColors(lore ? lore.replace(/\n/g, '<br>') : '');
  tooltipEl.style.display = 'block';
  positionTooltip(event);
}

function showSpecialTooltip(event, itemKey) {
  const item = SPECIAL_ITEMS_TOOLTIPS[itemKey];
  if (item) {
    showTooltip(event, item.name, item.lore);
  }
}

function positionTooltip(event) {
  const offset = 14;
  let x = event.clientX + offset;
  let y = event.clientY + offset;

  // Prevent offscreen overflow
  const bounds = tooltipEl.getBoundingClientRect();
  if (x + bounds.width > window.innerWidth) {
    x = event.clientX - bounds.width - offset;
  }
  if (y + bounds.height > window.innerHeight) {
    y = event.clientY - bounds.height - offset;
  }

  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top = `${y}px`;
}

function hideTooltip() {
  tooltipEl.style.display = 'none';
}

document.addEventListener('mousemove', (e) => {
  if (tooltipEl.style.display === 'block') {
    positionTooltip(e);
  }
});

// Copy IP helper
function copyServerIp() {
  navigator.clipboard.writeText('mc.dextrality.net').then(() => {
    alert('¡IP mc.dextrality.net copiada al portapapeles!');
  });
}

// --- SETUP EVENT LISTENERS ---
function initEvents() {
  // Era tabs
  const tabs = document.querySelectorAll('#eraTabs .mc-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-era');
      applyFilters();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    applyFilters();
  });

  // View toggle buttons
  const viewCardsBtn = document.getElementById('viewCardsBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  const cardsGrid = document.getElementById('ranksGrid');
  const tableWrapper = document.getElementById('ranksTableWrapper');

  viewCardsBtn.addEventListener('click', () => {
    viewCardsBtn.classList.add('active');
    viewTableBtn.classList.remove('active');
    cardsGrid.style.display = 'grid';
    tableWrapper.style.display = 'none';
  });

  viewTableBtn.addEventListener('click', () => {
    viewTableBtn.classList.add('active');
    viewCardsBtn.classList.remove('active');
    cardsGrid.style.display = 'none';
    tableWrapper.style.display = 'block';
  });
}

// Fetch ranks data
async function loadData() {
  if (window.RANKS_DATA && window.RANKS_DATA.ranks) {
    allRanks = window.RANKS_DATA.ranks;
    applyFilters();
    return;
  }
  try {
    const res = await fetch('ranks.json');
    const data = await res.json();
    allRanks = data.ranks;
    applyFilters();
  } catch (err) {
    console.error('Error fetching ranks.json:', err);
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  loadData();
});
