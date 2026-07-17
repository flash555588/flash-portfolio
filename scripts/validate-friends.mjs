import { readFile } from "node:fs/promises";

const file = new URL("../content/friends.json", import.meta.url);
const friends = JSON.parse(await readFile(file, "utf8"));

if (!Array.isArray(friends) || friends.length === 0) {
  throw new Error("content/friends.json 必须是非空数组");
}

const seenUrls = new Set();

for (const [index, friend] of friends.entries()) {
  const label = `友链 #${index + 1}`;
  if (!friend || typeof friend !== "object" || Array.isArray(friend)) {
    throw new Error(`${label} 必须是对象`);
  }

  for (const field of ["name", "description", "url"]) {
    if (typeof friend[field] !== "string" || !friend[field].trim()) {
      throw new Error(`${label} 缺少有效的 ${field}`);
    }
  }

  if (friend.name.length > 40 || friend.description.length > 80) {
    throw new Error(`${label} 的名称或描述过长`);
  }

  const url = new URL(friend.url);
  if (url.protocol !== "https:") {
    throw new Error(`${label} 必须使用 HTTPS`);
  }
  if (["localhost", "127.0.0.1"].includes(url.hostname)) {
    throw new Error(`${label} 不能指向本机地址`);
  }
  if (seenUrls.has(url.href)) {
    throw new Error(`${label} 与已有友链重复`);
  }
  seenUrls.add(url.href);
}

console.log(`已验证 ${friends.length} 条友链。`);
