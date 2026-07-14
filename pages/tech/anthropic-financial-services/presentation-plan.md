# 演示文稿大纲：Anthropics Financial Services（完整版）

## 总体结构 (46 页)

---

## 第一部分：总览与定位 (4 页)

| 页码 | 主题 | 内容要点 |
|------|------|----------|
| 01 | 封面 | 项目名称、副标题、开源数据 (33K⭐ / 4.9K Fork / 258 Subscribers)、作者署名、GitHub 链接 |
| 02 | 一句话定位 | "金融服务业的第一套开源 AI Agent 框架" — 覆盖投行、研究、私募、财富管理全栈 |
| 03 | 四大核心领域 | 投行 / 股票研究 / 私募 / 财富管理 — 四大领域 + 基金运营 + 合规运营 |
| 04 | 技术架构 | Agents (10+) + Vertical Plugins (9) + MCP Connectors (11) + Managed Agents API |

---

## 第二部分：核心能力总览 (3 页)

| 页码 | 主题 | 内容要点 |
|------|------|----------|
| 05 | 117+ 专业技能 | 按领域分类的技能矩阵：建模 13 / 分析 28 / 报告 25 / 合规 6 / 运营 15 / 其他 30 |
| 06 | Slash Commands | 20+ 个快捷指令：`/comps` `/dcf` `/lbo` `/earnings` `/ic-memo` `/teaser` 等 |
| 07 | 四种部署方式 | Cowork 插件 / CLI 安装 / Managed Agents API / Microsoft 365 Add-in — 各方式适用场景 |

---

## 第三部分：MCP 数据连接器详解 (11 页，每 1 页)

| 页码 | 数据源 | 核心功能 | 典型使用场景 | 对应 Skills |
|------|--------|----------|--------------|-------------|
| 08 | **Daloopa** | 分析师预期、目标价、评级变化、覆盖历史 |  earnings 预测、卖方共识、预期差分析 | earnings-analysis, morning-note |
| 09 | **Morningstar** | 股票/iForward 预期、基金数据、ESG 评分 | 基本面分析、估值基准、投资组合对比 | comps-analysis, sector-overview |
| 10 | **S&P Global (CapIQ)** | 公司财报、交易倍数、并购历史、债券数据 | 对标分析、折现现金流、并购建模 | comps-analysis, dcf-model, lbo-model |
| 11 | **FactSet** | 行业分类、机构持股、辛迪加数据、卖空数据 | 行业研究、股东结构分析、市场情绪 | competitive-analysis, thesis-tracker |
| 12 | **Moody's** | 信用评级、违约概率、风险指标、债券收益率 | 信用分析、资本成本计算、债务结构 | dcf-model, lbo-model, bond-futures-basis |
| 13 | **LSEG (Refinitiv)** | 债券估值、外汇点差、期权波动率、宏观数据 | 固定收入分析、FX 对冲、利率互换 | bond-rv, fx-carry, option-vol, swap-curve |
| 14 | **PitchBook** | PE/VC 交易、退出历史、基金表现、投资人网络 | 项目筛选、投后估值、退出策略 | deal-sourcing, valuation-reviewer, ic-memo |
| 15 | **Chronograph** | PE/VC 资产组合、增值机会、基金分层 | 投资组合监控、运营改进建议 | portfolio-monitoring, value-creation-plan |
| 16 | **MT Newswires** | 实时财经新闻、央行声明、经济数据发布 | 事件驱动、市场情绪、宏观触发器 | thesis-tracker, catalyst-calendar |
| 17 | **Aiera** | 宏观经济指标、全球 PMI、通胀预期、利率预期 | 宏观配置、经济周期定位、行业轮动 | sector-overview, macro-rates |
| 18 | **Box / Egnyte** | 企业文档存储、财务模型、交易书籍、合同 | 内部知识检索、模板管理、协作审查 | pitch-deck, datapack-builder, client-report |

---

## 第四部分：十大核心智能体详解 (20 页，每 Agent 2 页)

### 覆盖与 advisory 类

| 页码 | Agent | 核心功能 | 独特技能 |
|------|-------|----------|----------|
| 19-20 | **Pitch Agent** | 目标公司 + 战略情境 → 完整 pitch deck（comps + LBO + DCF + 品牌化 PPT） | `pitch-deck` `/ib-check-deck` `/deck-refresh` — 9 步端到端工作流 |
| 21-22 | **Meeting Prep Agent** | 会前简报包：客户背景 + 投资提案 + 比较分析 + 历史互动 | `client-report` `/investment-proposal` `/client-review` |

### 研究与建模类

| 页码 | Agent | 核心功能 | 独特技能 |
|------|-------|----------|----------|
| 23-24 | **Market Researcher** | 行业/主题 → 行业概览 + 竞争格局 + 对标公司 + 机会清单 | `competitive-analysis` `/sector-overview` `/idea-generation` |
| 25-26 | **Earnings Reviewer** | 业绩会 + filing → 模型更新 → 晨会笔记 | `earnings-analysis` `/earnings-preview` `/model-update` `/morning-note` |
| 27-28 | **Model Builder** | DCF / LBO / 三张表 / comps — 在 Excel 中生成可追踪公式 | `dcf-model` `/lbo-model` `/3-statement-model` `/audit-xls` |

### 基金运营与财务类

| 页码 | Agent | 核心功能 | 独特技能 |
|------|-------|----------|----------|
| 29-30 | **Valuation Reviewer** | 接收 GP 材料 → 估值模板 → 分期 LP 报告 | `package-reader` `/valuation-runner` `/portfolio-monitoring` `/ic-memo` |
| 31-32 | **GL Reconciler** | 发现断差 → 定位根因 → 分级审批 | `gl-recon` `/break-trace` — orchestrate 3 个子代理 (critic/reader/resolver) |
| 33-34 | **Month-End Closer** | 应计、滚动、差异评论 — 月结闭环 | `accrual-schedule` `/roll-forward` `/variance-commentary` |
| 35-36 | **Statement Auditor** | 审计 LP 材料后再分发 | `nav-tieout` `/statement-reader` `/flagger` / `reconciler` |

### 运营与合规类

| 页码 | Agent | 核心功能 | 独特技能 |
|------|-------|----------|----------|
| 37-38 | **KYC Screener** | 解析上板文档 → 运行规则引擎 → 标记缺口 | `kyc-doc-parse` `/kyc-rules` — 文档 reader + rules 引擎 + escalator |

---

## 第五部分：垂直插件深度 (6 页)

| 页码 | 插件 | 技能数 | 核心能力 | 典型 Commands |
|------|------|--------|----------|---------------|
| 39 | **financial-analysis** (核心) | 13 | 所有建模技能 + 11 个 MCP 连接器 | `/comps` `/dcf` `/lbo` `/debug-model` `/competitive-analysis` |
| 40 | **investment-banking** | 9 | CIM / teaser / buyer-list / merger-model / datapack / deal-tracker | `/cim` `/teaser` `/buyer-list` `/merger-model` `/one-pager` |
| 41 | **equity-research** | 9 | earnings 分析 / 研报初始化 / 模型更新 / 催化剂追踪 | `/earnings` `/initiate` `/model-update` `/catalysts` `/thesis` |
| 42 | **private-equity** | 10 | 项目筛选 / DD 清单 / IC memo / 投后监控 / 单体经济 | `/screen-deal` `/ic-memo` `/portfolio` `/dd-checklist` `/unit-economics` |
| 43 | **wealth-management** | 6 | 客户报告 / 财务规划 / 再平衡 / 税务损耗收割 | `/client-report` `/financial-plan` `/rebalance` `/tlh` |
| 44 | **fund-admin** | 6 | GL 核对 / 断差追踪 / 应计 / 滚动 / NAV 平账 / 差异评论 | `/gl-recon` `/break-trace` `/accrual-schedule` `/nav-tieout` |

---

## 第六部分：合作生态与快速开始 (3 页)

| 页码 | 主题 | 内容要点 |
|------|------|----------|
| 45 | 合作生态 | **LSEG** (债券/外汇/期权/宏观) + **S&P Global** (earnings preview / tear sheet / funding digest) — 合作伙伴专属技能 |
| 46 | 快速开始 | 安装命令 + GitHub 链接 + 官方文档：`claude plugin marketplace add anthropics/financial-services` |

---

## 每个 Agent 双页结构（示例）

### 左页（19 页）：Pitch Agent 概览
- **一句话定位**  
  > "投行 pitch deck 端到端生成器"
- **输入**  
  目标公司 ticker + 战略情境（冷启动 / 战略替代品 / 并购等）
- **输出**  
  1. Excel 估值工作簿（comps + precedent + DCF + LBO + football field）  
  2. 品牌化 PPT deck（每图链接到 Excel 命名范围）
- **适用场景**  
  MD/高级银行家要求 pitch 初稿，非编辑现有 deck

### 右页（20 页）：Pitch Agent 技术细节
- **核心技能链**  
  `sector-overview` → `comps-analysis` → `lbo-model` → `dcf-model` → `pitch-deck` → `ib-check-deck`
- **9 步工作流**  
  1. 确认目标与公司情境  
  2. 通过 CapIQ 拉取交易数据和 filing  
  3. spread 5-8 个对标 +5-10 笔交易  
  4. 构建 LBO（市场杠杆水平）  
  5. 构建 DCF + 三张表  
  6. 生成足球场估值图  
  7. 注入 PPT 模板  
  8. IB 检查叠加一致性  
  9. 等待人工复核签字
- **Guardrails**  
  每数必引；若无 CapIQ/ filing 支持，标记为 `[UNSOURCED]`  
  模型完成后停 → 复核 → deck 生成后停 → 复核 → 再下一步

---

## 每个 MCP 页面结构（示例）

### S&P Global (CapIQ) 页面

| 字段 | 内容 |
|------|------|
| **提供商** | S&P Global (Capital IQ) |
| **MCP 端点** | `https://kfinance.kensho.com/integrations/mcp` |
| **核心数据** | 财报、交易倍数、并购历史、债券数据、证券备案 |
| **关键功能** | - 实时股价与历史走势  
- 财务报表（损益表/资产负债表/现金流量表）  
- 交易倍数（EV/EBITDA, P/E, EV/Sales 等）  
- 并购交易历史与定价  
- 债券发行信息与收益率曲线 |
| **使用场景** | - comps-analysis：对标公司选取与倍数拉取  
- dcf-model：历史财务数据与 WACC 计算基准  
- lbo-model：收购价格与财务杠杆基准  
- pitch-deck：数据支撑所有估值图表 |
| **订阅要求** | 需要企业的 S&P Global / CapIQ 订阅 |
| **API 文档** | https://www.spglobal.com/ |

---

## 设计风格保持一致

- **配色**：slate-800 主色 + blue-600 强调色 + emerald-500 成功色 + amber-400 警告色
- **图标**：Phosphor Icons（`ph ph-<name>`）
- **布局**：卡片式 + `.card-gradient-border` + Tailwind 工具类
- **字体**：PingFang SC / Microsoft YaHei
- **信息密度**：单页 4-8 个信息点，每点 1-2 行

---

## 技能统计参考

| 类别 | 技能数 |
|------|--------|
| financial-analysis | 13 |
| investment-banking | 9 |
| equity-research | 9 |
| private-equity | 10 |
| wealth-management | 6 |
| fund-admin | 6 |
| operations | 2 |
| lseg (partner) | 8 |
| spglobal (partner) | 3 |
| **合计垂直技能** | **66** |
| Agent 捆绑技能（去重后） | **约 51** |
| **总计** | **117+** |

---

这个大纲包含：
- **4大核心领域**（投行、研究、私募、财富管理）+ 基金运营 + 合规运营
- **10个 Agent**（Pitch/Meeting Prep/Market Researcher/Earnings Reviewer/Model Builder/Valuation Reviewer/GL Reconciler/Month-End Closer/Statement Auditor/KYC Screener）
- **11个 MCP 数据连接器**（Daloopa/Morningstar/S&P/FactSet/Moody's/LSEG/PitchBook/Chronograph/MT Newswires/Aiera/Box 或 Egnyte）
- **9个垂直插件**（含布局统计）
- **2大市场合作**（LSEG、S&P Global）

页数：**46 页**

是否确认？如有调整请指出。确认后我将开始逐页生成内容。