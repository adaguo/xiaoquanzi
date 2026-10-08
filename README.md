# 小圈子

给每个小圈子一块黑板：组饭局、生日派对、读书会、团建、公益活动。

纯静态单文件站（`index.html`，约 1.1MB，资源已内联），数据层用 Supabase（project `Qiao`，表 `weekly_board`，各板按 boardId 前缀隔离）。

## 本地预览

```bash
cd xiaoquanzi
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

直接双击 `index.html` 也能开，但建议起本地服务，避免 file:// 限制。

## 部署到 Azure Static Web Apps

1. 把本仓库 push 到 GitHub。
2. Azure Portal → 新建 Static Web Apps → 选 Free 套餐 → 关联该 GitHub 仓库。
3. Build preset 选 Custom（无需构建），App location 填 `/`，Output location 留空。
4. 合并到 main 即自动部署；可绑自定义域名（如 `blackboard.club`），SSL 免费。

## 说明

- 后端仍在 Supabase 上，Azure 只托管前端；前端里的 Supabase 连接信息保持不变即可。
- 正式发布前建议把 Supabase anon key 的 RLS 策略收紧（当前为匿名可读写，见仓库 issue）。
