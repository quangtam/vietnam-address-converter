# 🚀 Hướng dẫn Setup GitHub Pages Demo

## 📋 Các bước setup

### 1. **Tạo GitHub Repository**
```bash
git init
git add .
git commit -m "feat: Initial commit with GitHub Pages demo"
git remote add origin https://github.com/quangtam/vietnam-address-converter.git
git branch -M main
git push -u origin main
```

### 2. **Bật GitHub Pages**
1. Vào repository GitHub: `https://github.com/quangtam/vietnam-address-converter`
2. Vào **Settings** → **Pages**
3. Chọn **Source**: `GitHub Actions`
4. Workflow sẽ tự động chạy và deploy

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
