"use client";

import { FormEvent, useMemo, useState } from "react";

type CategoryOption = {
  _id: string;
  title_zh: string;
  title_en: string;
};

type Props = {
  locale: string;
  categories: CategoryOption[];
};

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  productCategory: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  productCategory: "",
  message: "",
};

export default function ContactFormClient({ locale, categories }: Props) {
  const isZh = locale === "zh";
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [success, setSuccess] = useState(false);

  const options = useMemo(
    () =>
      categories.map((c) => ({
        id: c._id,
        label: pickLocale(locale, c.title_zh, c.title_en),
      })),
    [categories, locale]
  );

  function validate(data: FormState) {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!data.name.trim()) next.name = isZh ? "请输入姓名" : "Please enter your name";
    if (!data.email.trim()) {
      next.email = isZh ? "请输入邮箱" : "Please enter your email";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      next.email = isZh ? "邮箱格式不正确" : "Invalid email format";
    }
    if (!data.phone.trim()) next.phone = isZh ? "请输入电话" : "Please enter your phone";
    if (!data.message.trim()) next.message = isZh ? "请输入留言内容" : "Please enter your message";
    return next;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSuccess(true);
    setForm(initialState);
  }

  function fieldClass(hasError?: boolean) {
    return [
      "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition",
      hasError
        ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        : "border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100",
    ].join(" ");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-900">{isZh ? "在线询盘" : "Inquiry Form"}</h2>

      {success && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {isZh ? "提交成功，我们会尽快与您联系。" : "Submitted successfully. We will contact you soon."}
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{isZh ? "姓名" : "Name"} *</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{isZh ? "公司名称" : "Company"}</label>
          <input
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            className={fieldClass(Boolean(errors.company))}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{isZh ? "邮箱" : "Email"} *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={fieldClass(Boolean(errors.email))}
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{isZh ? "电话" : "Phone"} *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={fieldClass(Boolean(errors.phone))}
            />
            {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {isZh ? "感兴趣的产品" : "Interested Product"}
          </label>
          <select
            value={form.productCategory}
            onChange={(e) => setForm((f) => ({ ...f, productCategory: e.target.value }))}
            className={fieldClass(Boolean(errors.productCategory))}
          >
            <option value="">{isZh ? "请选择产品分类" : "Select a product category"}</option>
            {options.map((o) => (
              <option key={o.id} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{isZh ? "留言内容" : "Message"} *</label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className={fieldClass(Boolean(errors.message))}
          />
          {errors.message ? <p className="mt-1 text-xs text-rose-600">{errors.message}</p> : null}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          {isZh ? "提交询盘" : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}

