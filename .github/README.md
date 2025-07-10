# GitHub Actions Setup Guide

## 📋 Workflows Overview

Project này có 3 GitHub Actions workflows:

### 1. `build-test.yml` - CI Testing
**Trigger**: Push to `develop`, `feature/*` branches và Pull Requests
**Chức năng**: 
- Test trên Node.js 16, 18, 20
- Run linter và tests
- Build library
- Test demo script

### 2. `deploy.yml` - GitHub Pages Deployment  
**Trigger**: Push to `main` branch
**Chức năng**:
- Build và test library
- Deploy thư mục `docs/` lên GitHub Pages
- Tự động cập nhật demo tại: https://quangtam.github.io/vietnam-address-converter/

### 3. `release.yml` - NPM Publishing
**Trigger**: Push git tags (vd: `v1.0.5`)
**Chức năng**:
- Test và build library
- Publish lên NPM registry
- Tạo GitHub Release

## 🔧 Setup Required

### 1. GitHub Pages Setup
1. Vào **Settings** > **Pages**
2. Source: **GitHub Actions**
3. GitHub sẽ tự động enable Pages deployment

### 2. NPM Token Setup (cho release.yml)
1. Tạo NPM Access Token:
   ```bash
   npm login
   npm token create --type=automation
   ```
2. Vào **Settings** > **Secrets and variables** > **Actions**
3. Thêm secret: `NPM_TOKEN` = your_npm_token

### 3. Repository Permissions
Đảm bảo workflow có quyền:
- **Settings** > **Actions** > **General**
- **Workflow permissions**: Read and write permissions
- **Allow GitHub Actions to create and approve pull requests**: ✅

## 🚀 Workflow Usage

### Development Flow
```bash
# Feature development
git checkout -b feature/new-feature
git push origin feature/new-feature  # Triggers build-test.yml

# Pull Request
# Tạo PR từ feature -> main    # Triggers build-test.yml

# Merge to main
git checkout main
git merge feature/new-feature
git push origin main          # Triggers deploy.yml
```

### Release Flow
```bash
# Update version
npm version patch  # hoặc minor, major

# Push tag
git push origin --tags        # Triggers release.yml
```

## 📊 Status Badges

Thêm vào README.md:

```markdown
[![Build Status](https://github.com/quangtam/vietnam-address-converter/workflows/Build%20and%20Test/badge.svg)](https://github.com/quangtam/vietnam-address-converter/actions)
[![Deploy Status](https://github.com/quangtam/vietnam-address-converter/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/quangtam/vietnam-address-converter/actions)
```

## 🛠️ Troubleshooting

### Common Issues

1. **GitHub Pages không deploy**
   - Kiểm tra thư mục `docs/` có tồn tại
   - Kiểm tra workflow permissions

2. **NPM publish thất bại**
   - Kiểm tra NPM_TOKEN secret
   - Kiểm tra version đã tăng chưa
   - Kiểm tra package name availability

3. **Tests fail trên CI**
   - Test local trước: `npm test`
   - Kiểm tra Node.js version compatibility

### Manual Triggers

Có thể trigger manual từ GitHub UI:
- **Actions** tab > **Deploy to GitHub Pages** > **Run workflow**

## 📝 Notes

- Workflow `deploy.yml` chỉ chạy trên `main` branch
- Demo sử dụng CDN nên không cần build files trong docs/
- Release workflow cần git tag để trigger
- All workflows require passing tests
