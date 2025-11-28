import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import FormData from "form-data";
import type { NextRequest } from "next/server";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

export class ServerAPI {
  private axios: AxiosInstance;

  constructor(baseServerURL = SERVER_URL) {
    this.axios = axios.create({
      baseURL: `${baseServerURL.replace(/\/$/, "")}/api/v1`,
      timeout: 30_000,
    });
  }

  private pickForwardHeaders(req?: NextRequest) {
    if (!req) return {};
    const headers: Record<string, string> = {};
    const auth = req.headers.get("authorization");
    const cookie = req.headers.get("cookie");
    const ct = req.headers.get("content-type");

    if (auth) headers["authorization"] = auth;
    if (cookie) headers["cookie"] = cookie;
    if (ct && !ct.startsWith("multipart/")) headers["content-type"] = ct;

    return headers;
  }

  async postJson(
    req: NextRequest | undefined,
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ) {
    const payload = body ?? (req ? await req.json().catch(() => ({})) : {});
    const headers = this.pickForwardHeaders(req);

    const res = await this.axios.post(path, payload, {
      headers,
      ...config,
    });

    return { status: res.status, data: res.data?.data, headers: res.headers };
  }

  async postForm(req: NextRequest, path: string, config?: AxiosRequestConfig) {
    const incoming = await req.formData();
    const form = new FormData();

    for (const [key, value] of incoming.entries()) {
      if (typeof value === "string") {
        form.append(key, value);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const file = value as any;
        const ab = await file.arrayBuffer();
        const buf = Buffer.from(ab);
        form.append("file", buf, {
          filename: file.name,
          contentType: file.type || undefined,
          knownLength: buf.length,
        });
      }
    }

    const headers = {
      ...this.pickForwardHeaders(req),
      ...form.getHeaders(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await this.axios.post(path, form as any, {
      headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      ...config,
    });

    return { status: res.status, data: res.data, headers: res.headers };
  }
}

export const serverAPI = new ServerAPI();
