# 🚀 Hướng dẫn Setup GitHub Pages Demo

## ⚠️ Troubleshooting GitHub Actions Error

Nếu gặp lỗi: `Get Pages site failed. Please verify that the repository has Pages enabled...`

### Bước 1: Bật GitHub Pages thủ công
1. Vào repository GitHub: `https://github.com/quangtam/vietnam-address-converter`
2. Vào **Settings** → **Pages** (ở sidebar bên trái)
3. Trong **Source**, chọn **GitHub Actions** (không chọn Deploy from branch)
4. Nhấn **Save**

### Bước 2: Kiểm tra Permissions
1. Vào **Settings** → **Actions** → **General**
2. Scroll xuống **Workflow permissions**
3. Chọn **Read and write permissions**
4. Tick vào **Allow GitHub Actions to create and approve pull requests**
5. Nhấn **Save**

### Bước 3: Chạy workflow thủ công
1. Vào tab **Actions**
2. Chọn workflow **Manual Deploy Pages**
3. Nhấn **Run workflow** → **Run workflow**

## 📋 Các bước setup (sau khi sửa lỗi)

### 1. **Tạo GitHub Repository**
```bash
git add .
git commit -m "fix: Add multiple GitHub Pages workflows"
git push origin main
```

### 2. **Bật GitHub Pages** (quan trọng!)
1. Vào repository GitHub
2. **Settings** → **Pages**  
3. **Source**: Chọn **GitHub Actions** (KHÔNG chọn branch)
4. **Save**

### 3. **Set Permissions**
1. **Settings** → **Actions** → **General**
2. **Workflow permissions**: **Read and write permissions**
3. Tick **Allow GitHub Actions to create and approve pull requests**

### 4. **Test Manual Deploy**
1. **Actions** tab
2. Chọn **Manual Deploy Pages**
3. **Run workflow**

### 3. **Truy cập Demo**
- URL: `https://quangtam.github.io/vietnam-address-converter`
- Thời gian deploy: ~2-3 phút

## 🎯 Tính năng của Demo

### ✨ **Interactive Demo**
- Giao diện responsive, đẹp mắt
- Chuyển đổi địa chỉ real-time
- Hiển thị thống kê dữ liệu
- Ví dụ mẫu để test

### 🔧 **Technical Features**
- Pure JavaScript (không cần build)
- Bootstrap 5 UI
- Font Awesome icons
- Mobile-friendly design
- SEO optimized

### 📊 **Demo Data**
- 34 tỉnh/thành phố
- 3,321 phường/xã
- 10,039 quy tắc mapping
- Các case test thực tế

## 🛠️ **Customization**

### Cập nhật Demo Data
Chỉnh sửa file `docs/demo.js` để:
- Thêm mapping rules mới
- Cập nhật thống kê
- Thay đổi ví dụ mẫu

### Styling
Chỉnh sửa `docs/index.html` để:
- Thay đổi theme colors
- Cập nhật layout
- Thêm tính năng mới

## 🔄 **Auto Deploy**
- GitHub Actions sẽ tự động deploy khi push code
- Workflow file: `.github/workflows/deploy-pages.yml`
- Deploy time: ~2-3 phút

## 🎉 **Kết quả**
Sau khi setup xong, bạn sẽ có:

✅ Demo online hoạt động 24/7  
✅ URL thân thiện: `quangtam.github.io/vietnam-address-converter`  
✅ Tự động cập nhật khi push code  
✅ Mobile-friendly interface  
✅ SEO optimized  
✅ Fast loading  

---

**🌟 Pro Tips:**
- Thêm custom domain nếu có
- Enable HTTPS (mặc định đã có)
- Sử dụng CDN link sau khi publish npm package
- Thêm Google Analytics để track usage
