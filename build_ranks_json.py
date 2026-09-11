import re
import json

config_path = "/Users/alain/Projects/Fixer/Java/Plugins/Projects/Delwer_/delwerIslandRanks/src/main/resources/config.yml"
with open(config_path, "r", encoding="utf-8") as f:
    content = f.read()

rank_blocks = re.split(r"(?m)^([a-z0-9_-]+):\n", content)
ranks = []

def parse_list(text, key):
    m = re.search(rf"{key}:\s*\n((?:\s+-\s+[^\n]+\n)+)", text)
    if not m:
        return []
    raw = m.group(1)
    items = []
    for line in raw.strip().splitlines():
        line = line.strip()
        if line.startswith("- "):
            val = line[2:].strip().strip("\"'")
            items.append(val)
    return items

def parse_bonuses(text):
    m = re.search(r"island-bonuses:\s*\n((?:\s+[a-z0-9_-]+:\s*[^\n]+\n)+)", text)
    if not m:
        return {}
    bonuses = {}
    for line in m.group(1).strip().splitlines():
        line = line.strip()
        parts = line.split(":", 1)
        if len(parts) == 2:
            k = parts[0].strip()
            v = parts[1].strip()
            try:
                if "." in v:
                    bonuses[k] = float(v)
                else:
                    bonuses[k] = int(v)
            except:
                bonuses[k] = v
    return bonuses

for i in range(1, len(rank_blocks), 2):
    r_key = rank_blocks[i]
    r_body = rank_blocks[i+1]
    
    m_w = re.search(r"weigth:\s*(\d+)", r_body)
    if not m_w:
        continue
    weight = int(m_w.group(1))
    
    m_name = re.search(r"name:\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]", r_body)
    m_cname = re.search(r"color-name:\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]", r_body)
    m_money = re.search(r"money:\s*(\d+)", r_body)
    m_xp = re.search(r"xp:\s*(\d+)", r_body)
    m_mkills = re.search(r"mob-kills:\s*(\d+)", r_body)
    m_pkills = re.search(r"player-kills:\s*(\d+)", r_body)
    
    raw_items = parse_list(r_body, "items")
    parsed_items = []
    for item_str in raw_items:
        # e.g. "vanillaitem,OAK_LOG,64" or "customitem,item_name,32"
        parts = item_str.split(",")
        if len(parts) >= 3:
            parsed_items.append({
                "type": parts[0].strip(),
                "material": parts[1].strip(),
                "amount": int(parts[2].strip())
            })
        else:
            parsed_items.append({
                "type": "vanillaitem",
                "material": parts[0].strip(),
                "amount": 1
            })
            
    raw_conditions = parse_list(r_body, "conditions")
    parsed_conditions = []
    for cond_str in raw_conditions:
        # e.g. "oneblock.phase >= 1 | Fase OneBlock: Planicie | GRASS_BLOCK"
        parts = [p.strip() for p in cond_str.split("|")]
        expr = parts[0] if len(parts) > 0 else ""
        label = parts[1] if len(parts) > 1 else expr
        icon = parts[2] if len(parts) > 2 else "BOOK"
        parsed_conditions.append({
            "expression": expr,
            "label": label,
            "icon": icon
        })
        
    bonuses = parse_bonuses(r_body)
    daily_cmds = parse_list(r_body, "daily-commands")
    daily_bens = parse_list(r_body, "daily-beneficies")
    week_cmds = parse_list(r_body, "week-commands")
    week_bens = parse_list(r_body, "week-beneficies")
    month_cmds = parse_list(r_body, "month-commands")
    month_bens = parse_list(r_body, "month-beneficies")
    unique_cmds = parse_list(r_body, "unique-commands")
    unique_bens = parse_list(r_body, "unique-beneficies")
    
    has_set = None
    if weight == 10:
        has_set = {
            "name": "Set Señor del Diamante",
            "weapon": "Arco del Señor del Diamante",
            "material": "NETHERITE",
            "type": "Bow + Armor Set"
        }
    elif weight == 20:
        has_set = {
            "name": "Set Titán del Abismo",
            "weapon": "Filo del Titán Abisal",
            "material": "NETHERITE",
            "type": "Sword + Armor Set"
        }
    elif weight == 30:
        has_set = {
            "name": "Set Deidad del OneBlock",
            "weapon": "Hacha de la Deidad",
            "material": "NETHERITE",
            "type": "Axe + Armor Set"
        }
        
    # Determine era
    if weight < 10:
        era = "Era I: Inicial"
        era_id = 1
    elif weight < 20:
        era = "Era II: Diamante y Arcano"
        era_id = 2
    elif weight < 30:
        era = "Era III: Titán y Abismo"
        era_id = 3
    else:
        era = "Era IV: Deidad Suprema"
        era_id = 4
        
    ranks.append({
        "key": r_key,
        "weight": weight,
        "name": m_name.group(1) if m_name else r_key,
        "colorName": m_cname.group(1) if m_cname else r_key,
        "era": era,
        "eraId": era_id,
        "requirements": {
            "money": int(m_money.group(1)) if m_money else 0,
            "xp": int(m_xp.group(1)) if m_xp else 0,
            "mobKills": int(m_mkills.group(1)) if m_mkills else 0,
            "playerKills": int(m_pkills.group(1)) if m_pkills else 0,
            "items": parsed_items,
            "conditions": parsed_conditions
        },
        "islandBonuses": bonuses,
        "rewards": {
            "daily": {
                "commands": daily_cmds,
                "beneficies": daily_bens
            },
            "weekly": {
                "commands": week_cmds,
                "beneficies": week_bens
            },
            "monthly": {
                "commands": month_cmds,
                "beneficies": month_bens
            },
            "unique": {
                "commands": unique_cmds,
                "beneficies": unique_bens,
                "specialSet": has_set
            }
        }
    })

ranks.sort(key=lambda x: x["weight"])

out_path = "/Users/alain/Projects/islandranks-web/ranks.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump({"ranks": ranks, "total": len(ranks)}, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {out_path} with {len(ranks)} ranks!")
