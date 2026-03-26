/**
 * Sanity 测试数据种子脚本
 * 运行前请设置环境变量（可从 .env.local 复制）：
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN（在 https://www.sanity.io/manage 中创建 API Token，勾选 Editor 权限）
 *
 * 运行: node scripts/seed-sanity.mjs
 * 或: npm run seed:sanity
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("缺少 NEXT_PUBLIC_SANITY_PROJECT_ID 或 SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const CAT_IDS = {
  industrial: "productCategory-industrial",
  commercial: "productCategory-commercial",
  precision: "productCategory-precision",
  custom: "productCategory-custom",
};

const COMPANY_INFO_ID = "companyInfo";

function makeSvgPlaceholder(title, subtitle, bg = "#0f172a") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect x="80" y="80" width="1040" height="740" rx="24" fill="none" stroke="#7dd3fc" stroke-width="4"/>
  <text x="600" y="410" text-anchor="middle" font-size="64" font-family="Arial, sans-serif" fill="#e2e8f0">${title}</text>
  <text x="600" y="500" text-anchor="middle" font-size="36" font-family="Arial, sans-serif" fill="#cbd5e1">${subtitle}</text>
</svg>`;
}

async function seed() {
  console.log("Seeding product categories...");
  await Promise.all([
    client.createOrReplace({
      _id: CAT_IDS.industrial,
      _type: "productCategory",
      title_zh: "工业秤",
      title_en: "Industrial Scales",
      slug: { _type: "slug", current: "industrial" },
      description_zh: "适用于生产线、仓储、物流等重载称重场景，高精度、高稳定性。",
      description_en: "For production lines, warehousing and logistics weighing. High accuracy and stability.",
      order: 0,
    }),
    client.createOrReplace({
      _id: CAT_IDS.commercial,
      _type: "productCategory",
      title_zh: "商用秤",
      title_en: "Commercial Scales",
      slug: { _type: "slug", current: "commercial" },
      description_zh: "零售、超市、农贸市场的称重与计价解决方案。",
      description_en: "Weighing and pricing solutions for retail, supermarkets and markets.",
      order: 1,
    }),
    client.createOrReplace({
      _id: CAT_IDS.precision,
      _type: "productCategory",
      title_zh: "精密天平",
      title_en: "Precision Balances",
      slug: { _type: "slug", current: "precision" },
      description_zh: "实验室与质检领域的高精度称重设备。",
      description_en: "High-accuracy weighing equipment for labs and quality control.",
      order: 2,
    }),
    client.createOrReplace({
      _id: CAT_IDS.custom,
      _type: "productCategory",
      title_zh: "定制方案",
      title_en: "Custom Solutions",
      slug: { _type: "slug", current: "custom" },
      description_zh: "根据您的场景需求提供专属设计与集成服务。",
      description_en: "Tailored design and integration for your needs.",
      order: 3,
    }),
  ]);

  console.log("Seeding products...");
  const productSpecs = [
    { name_zh: "量程", name_en: "Capacity", value_zh: "0-30kg", value_en: "0-30kg" },
    { name_zh: "精度", name_en: "Accuracy", value_zh: "±2g", value_en: "±2g" },
    { name_zh: "分度值", name_en: "Division", value_zh: "1g", value_en: "1g" },
    { name_zh: "工作温度", name_en: "Operating Temp", value_zh: "-10℃～40℃", value_en: "-10℃～40℃" },
    { name_zh: "防护等级", name_en: "IP Rating", value_zh: "IP65", value_en: "IP65" },
  ];

  const products = [
    { slug: "industrial-floor-scale", title_zh: "工业地磅秤", title_en: "Industrial Floor Scale", cat: CAT_IDS.industrial, desc_zh: "适用于仓库、车间等场所的重型称重。", desc_en: "Heavy-duty weighing for warehouses and workshops.", apps_zh: ["仓储称重", "物流分拣", "生产线"], apps_en: ["Warehouse weighing", "Logistics sorting", "Production line"], order: 0 },
    { slug: "industrial-bench-scale", title_zh: "工业台秤", title_en: "Industrial Bench Scale", cat: CAT_IDS.industrial, desc_zh: "紧凑型台面称重，适合车间与收发货。", desc_en: "Compact bench weighing for workshops and shipping.", apps_zh: ["收发货", "配料", "质检"], apps_en: ["Shipping & receiving", "Batching", "QC"], order: 1 },
    { slug: "retail-scale", title_zh: "零售计价秤", title_en: "Retail Pricing Scale", cat: CAT_IDS.commercial, desc_zh: "支持条码、计价、标签打印的一体化商用秤。", desc_en: "All-in-one scale with barcode, pricing and label printing.", apps_zh: ["超市", "便利店", "农贸市场"], apps_en: ["Supermarkets", "Convenience stores", "Markets"], order: 0 },
    { slug: "counter-scale", title_zh: "柜台秤", title_en: "Counter Scale", cat: CAT_IDS.commercial, desc_zh: "小巧耐用，适合柜台与收银台使用。", desc_en: "Compact and durable for counters and checkout.", apps_zh: ["餐饮", "零售", "珠宝"], apps_en: ["Food service", "Retail", "Jewelry"], order: 1 },
    { slug: "analytical-balance", title_zh: "分析天平", title_en: "Analytical Balance", cat: CAT_IDS.precision, desc_zh: "毫克级精度，适用于实验室与研发。", desc_en: "Milligram accuracy for labs and R&D.", apps_zh: ["实验室", "制药", "科研"], apps_en: ["Laboratory", "Pharma", "Research"], order: 0 },
    { slug: "precision-balance", title_zh: "精密电子天平", title_en: "Precision Electronic Balance", cat: CAT_IDS.precision, desc_zh: "高重复性与稳定性，满足质检要求。", desc_en: "High repeatability and stability for QC.", apps_zh: ["质检", "计量", "教育"], apps_en: ["QC", "Metrology", "Education"], order: 1 },
    { slug: "custom-conveyor-scale", title_zh: "定制皮带秤系统", title_en: "Custom Conveyor Scale System", cat: CAT_IDS.custom, desc_zh: "根据产线节拍与物料特性定制的连续称重方案。", desc_en: "Custom continuous weighing for your line and materials.", apps_zh: ["生产线", "包装线", "物流"], apps_en: ["Production line", "Packaging", "Logistics"], order: 0 },
    { slug: "custom-weighing-module", title_zh: "称重模块集成方案", title_en: "Weighing Module Integration", cat: CAT_IDS.custom, desc_zh: "将称重集成到现有设备或自动化系统中。", desc_en: "Integrate weighing into existing equipment or automation.", apps_zh: ["设备集成", "自动化", "MES"], apps_en: ["Equipment integration", "Automation", "MES"], order: 1 },
  ];

  for (const p of products) {
    await client.createOrReplace({
      _type: "product",
      _id: `product-${p.slug}`,
      title_zh: p.title_zh,
      title_en: p.title_en,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: p.cat },
      description_zh: [{ _type: "block", _key: "d1", style: "normal", children: [{ _type: "span", _key: "c1", text: p.desc_zh }] }],
      description_en: [{ _type: "block", _key: "d1", style: "normal", children: [{ _type: "span", _key: "c1", text: p.desc_en }] }],
      specs: productSpecs,
      applications_zh: p.apps_zh,
      applications_en: p.apps_en,
      featured: p.slug === "industrial-floor-scale" || p.slug === "retail-scale" || p.slug === "analytical-balance",
      order: p.order,
    });
  }

  console.log("Seeding posts...");
  const posts = [
    { slug: "expo-2024", title_zh: "ScaleTech 亮相 2024 国际工业博览会", title_en: "ScaleTech at 2024 International Industrial Expo", excerpt_zh: "展示最新智能称重系统与物联网解决方案，吸引众多行业客户洽谈合作。", excerpt_en: "Showcasing smart weighing systems and IoT solutions, attracting numerous industry partners.", publishedAt: "2024-01-15T10:00:00Z", category: "company" },
    { slug: "precision-balance-certified", title_zh: "新一代精密天平通过国家计量认证", title_en: "New Precision Balance Certified by National Metrology", excerpt_zh: "产品在精度、稳定性与智能化方面达到行业领先水平。", excerpt_en: "Leading the industry in accuracy, stability and smart features.", publishedAt: "2024-02-20T09:00:00Z", category: "product" },
    { slug: "european-logistics-partnership", title_zh: "与欧洲知名物流企业达成战略合作", title_en: "Strategic Partnership with European Logistics Leader", excerpt_zh: "为其全球仓储网络提供称重与分拣一体化设备。", excerpt_en: "Providing integrated weighing and sorting equipment for their global network.", publishedAt: "2024-03-05T14:00:00Z", category: "industry" },
  ];

  for (const post of posts) {
    await client.createOrReplace({
      _type: "post",
      _id: `post-${post.slug}`,
      title_zh: post.title_zh,
      title_en: post.title_en,
      slug: { _type: "slug", current: post.slug },
      category: post.category,
      excerpt_zh: post.excerpt_zh,
      excerpt_en: post.excerpt_en,
      publishedAt: post.publishedAt,
      body_zh: [{ _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: post.excerpt_zh }] }],
      body_en: [{ _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: post.excerpt_en }] }],
    });
  }

  console.log("Seeding company info...");
  const certSvgs = [
    makeSvgPlaceholder("ISO 9001", "Quality Management", "#0b3b66"),
    makeSvgPlaceholder("CE", "EU Compliance", "#1e3a8a"),
    makeSvgPlaceholder("RoHS", "Environmental Standard", "#14532d"),
    makeSvgPlaceholder("Calibration", "Metrology Certificate", "#4a044e"),
  ];

  const certAssets = [];
  for (let i = 0; i < certSvgs.length; i += 1) {
    const uploaded = await client.assets.upload(
      "image",
      Buffer.from(certSvgs[i], "utf-8"),
      {
        filename: `cert-placeholder-${i + 1}.svg`,
        contentType: "image/svg+xml",
      }
    );
    certAssets.push(uploaded);
  }

  await client.createOrReplace({
    _id: COMPANY_INFO_ID,
    _type: "companyInfo",
    about_zh: [
      {
        _type: "block",
        _key: "about-zh-1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "about-zh-1-span",
            text: "ScaleTech 专注电子衡器研发与制造二十余年，业务覆盖工业称重、商用计价、精密实验室称量及自动化定制集成。我们坚持以稳定可靠的硬件设计、严谨的软件算法和完善的全球服务体系，为客户提供可持续的称重解决方案。",
          },
        ],
      },
    ],
    about_en: [
      {
        _type: "block",
        _key: "about-en-1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "about-en-1-span",
            text: "ScaleTech has specialized in electronic weighing R&D and manufacturing for over 20 years, covering industrial weighing, commercial pricing, precision laboratory balancing, and custom automation integration. We deliver sustainable weighing solutions through reliable hardware, robust software algorithms, and global service support.",
          },
        ],
      },
    ],
    milestones: [
      {
        _key: "ms-2010",
        year: "2010",
        title_zh: "公司成立",
        title_en: "Company Founded",
        description_zh: "ScaleTech 在深圳成立，专注工业称重产品研发。",
        description_en: "ScaleTech was founded in Shenzhen, focusing on industrial weighing products.",
      },
      {
        _key: "ms-2013",
        year: "2013",
        title_zh: "推出第一代智能工业秤",
        title_en: "First Smart Industrial Scale Launched",
        description_zh: "完成首代联网工业秤量产，并进入物流行业头部客户。",
        description_en: "Mass-produced the first connected industrial scale and entered top-tier logistics accounts.",
      },
      {
        _key: "ms-2017",
        year: "2017",
        title_zh: "海外市场拓展",
        title_en: "Global Expansion",
        description_zh: "产品出口覆盖 30+ 国家，建立欧洲与东南亚服务网络。",
        description_en: "Expanded exports to 30+ countries and established service networks in Europe and Southeast Asia.",
      },
      {
        _key: "ms-2021",
        year: "2021",
        title_zh: "实验室精密产品线升级",
        title_en: "Precision Lab Product Upgrade",
        description_zh: "发布新一代精密天平，满足药企与科研机构高标准要求。",
        description_en: "Released next-gen precision balances for pharmaceutical and research institutions.",
      },
      {
        _key: "ms-2024",
        year: "2024",
        title_zh: "智能工厂二期投产",
        title_en: "Smart Factory Phase II",
        description_zh: "新增自动化装配与检测产线，整体交付效率提升 35%。",
        description_en: "Launched new automated assembly and inspection lines, improving delivery efficiency by 35%.",
      },
    ],
    certifications: certAssets.map((asset, idx) => ({
      _key: `cert-${idx + 1}`,
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    })),
  });

  console.log("Seed completed.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
