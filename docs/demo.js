// Demo script cho GitHub Pages
// Sử dụng CDN version của thư viện (sau khi publish lên npm)

let converter = null;

// Initialize the converter
async function initializeConverter() {
    try {
        // Tạm thời sử dụng demo data - sau khi publish sẽ dùng CDN
        converter = {
            async initialize() {
                // Simulate loading
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Load demo data
                this.demoData = {
                    provinces: 34,
                    wards: 3321,
                    mappings: 10039
                };
                
                // Demo mapping rules
                this.mappingRules = [
                    {
                        old: "Xã Văn Luông, Huyện Tân Sơn, Tỉnh Phú Thọ",
                        new: { ward: "Xã Minh Đài", province: "Phú Thọ" },
                        type: "merged"
                    },
                    {
                        old: "Phường An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh",
                        new: { ward: "Phường An Lạc", province: "Thành phố Hồ Chí Minh" },
                        type: "district_removed"
                    },
                    {
                        old: "Xã Phú Hồng, Huyện Ba Vì, Thành phố Hà Nội",
                        new: { ward: "Xã Cổ Đô", province: "Thành phố Hà Nội" },
                        type: "renamed"
                    },
                    {
                        old: "123 Nguyễn Văn Cừ, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh",
                        new: { ward: "Phường 05", province: "Thành phố Hồ Chí Minh", street: "123 Nguyễn Văn Cừ" },
                        type: "district_removed"
                    }
                ];
            },
            
            convertAddress(address) {
                // Simulate conversion logic
                const normalizedInput = address.toLowerCase().trim();
                
                // Find matching rule
                const rule = this.mappingRules.find(r => 
                    normalizedInput.includes(r.old.toLowerCase()) || 
                    r.old.toLowerCase().includes(normalizedInput)
                );
                
                if (rule) {
                    return {
                        success: true,
                        originalAddress: address,
                        convertedAddress: rule.new,
                        hasChanges: true,
                        mappingInfo: {
                            mappingType: rule.type,
                            confidence: 0.95
                        }
                    };
                }
                
                // Try fuzzy matching
                for (const rule of this.mappingRules) {
                    const similarity = calculateSimilarity(normalizedInput, rule.old.toLowerCase());
                    if (similarity > 0.6) {
                        return {
                            success: true,
                            originalAddress: address,
                            convertedAddress: rule.new,
                            hasChanges: true,
                            mappingInfo: {
                                mappingType: rule.type + "_fuzzy",
                                confidence: similarity
                            }
                        };
                    }
                }
                
                // No match found
                return {
                    success: false,
                    originalAddress: address,
                    error: "Không tìm thấy quy tắc chuyển đổi phù hợp",
                    message: "Địa chỉ này có thể không cần chuyển đổi hoặc chưa có trong cơ sở dữ liệu"
                };
            },
            
            getDataStats() {
                return this.demoData;
            }
        };
        
        await converter.initialize();
        
        // Update stats
        const stats = converter.getDataStats();
        document.getElementById('provincesCount').textContent = stats.provinces.toLocaleString();
        document.getElementById('wardsCount').textContent = stats.wards.toLocaleString();
        document.getElementById('mappingsCount').textContent = stats.mappings.toLocaleString();
        
        console.log('✅ Converter initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize converter:', error);
        showError('Không thể khởi tạo converter: ' + error.message);
    }
}

// Convert address function
async function convertAddress() {
    const input = document.getElementById('addressInput').value.trim();
    
    if (!input) {
        showError('Vui lòng nhập địa chỉ cần chuyển đổi');
        return;
    }
    
    if (!converter) {
        showError('Converter chưa được khởi tạo');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = converter.convertAddress(input);
        
        showLoading(false);
        displayResult(result);
        
    } catch (error) {
        showLoading(false);
        showError('Lỗi khi chuyển đổi: ' + error.message);
    }
}

// Display conversion result
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    
    if (result.success) {
        const { convertedAddress, mappingInfo, hasChanges } = result;
        
        // Format converted address
        const newAddressParts = [];
        if (convertedAddress.street) newAddressParts.push(convertedAddress.street);
        if (convertedAddress.ward) newAddressParts.push(convertedAddress.ward);
        if (convertedAddress.province) newAddressParts.push(convertedAddress.province);
        
        const mappingTypeText = getMappingTypeText(mappingInfo?.mappingType);
        const confidencePercent = Math.round((mappingInfo?.confidence || 1) * 100);
        
        resultDiv.innerHTML = `
            <div class="result-card">
                <h5 class="text-success">
                    <i class="fas fa-check-circle"></i>
                    Chuyển đổi thành công
                </h5>
                
                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted">Địa chỉ cũ:</h6>
                        <p class="border-start border-3 border-warning ps-3">
                            ${result.originalAddress}
                        </p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Địa chỉ mới:</h6>
                        <p class="border-start border-3 border-success ps-3">
                            ${newAddressParts.join(', ')}
                        </p>
                    </div>
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-6">
                        <small class="text-muted">
                            <strong>Loại chuyển đổi:</strong> ${mappingTypeText}
                        </small>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted">
                            <strong>Độ tin cậy:</strong> ${confidencePercent}%
                        </small>
                    </div>
                </div>
                
                ${hasChanges ? 
                    '<div class="alert alert-info mt-3 mb-0"><i class="fas fa-info-circle"></i> <strong>Lưu ý:</strong> Cấp quận/huyện đã được loại bỏ theo Nghị quyết 202/2025/QH15</div>' : 
                    '<div class="alert alert-warning mt-3 mb-0"><i class="fas fa-exclamation-triangle"></i> Địa chỉ này không cần thay đổi</div>'
                }
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="error-card">
                <h5 class="text-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Không thể chuyển đổi
                </h5>
                <p class="mb-2"><strong>Lỗi:</strong> ${result.error}</p>
                <p class="mb-0"><small class="text-muted">${result.message}</small></p>
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="error-card">
            <h5 class="text-danger">
                <i class="fas fa-exclamation-triangle"></i>
                Lỗi
            </h5>
            <p class="mb-0">${message}</p>
        </div>
    `;
}

// Show/hide loading state
function showLoading(show) {
    const button = document.getElementById('convertBtn');
    const loading = button.querySelector('.loading');
    const icon = button.querySelector('.fas');
    
    if (show) {
        loading.style.display = 'inline';
        icon.style.display = 'none';
        button.disabled = true;
    } else {
        loading.style.display = 'none';
        icon.style.display = 'inline';
        button.disabled = false;
    }
}

// Set example input
function setExample(address) {
    document.getElementById('addressInput').value = address;
    convertAddress();
}

// Get mapping type text
function getMappingTypeText(type) {
    const types = {
        'merged': 'Gộp địa phương',
        'renamed': 'Đổi tên',
        'district_removed': 'Loại bỏ quận/huyện',
        'merged_fuzzy': 'Gộp địa phương (tìm kiếm mờ)',
        'renamed_fuzzy': 'Đổi tên (tìm kiếm mờ)',
        'district_removed_fuzzy': 'Loại bỏ quận/huyện (tìm kiếm mờ)'
    };
    return types[type] || 'Không xác định';
}

// Simple similarity calculation
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Handle Enter key press and button clicks
document.addEventListener('DOMContentLoaded', function() {
    // Enter key handler
    document.getElementById('addressInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (typeof convertAddress === 'function') {
                convertAddress();
            }
        }
    });
    
    // Convert button click handler
    document.getElementById('convertBtn').addEventListener('click', function() {
        if (typeof convertAddress === 'function') {
            convertAddress();
        }
    });
    
    // Example items click handlers
    document.querySelectorAll('.example-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const address = this.getAttribute('data-address');
            if (typeof setExample === 'function') {
                setExample(address);
            }
        });
    });
    
    // Initialize converter when page loads
    initializeConverter();
});

// Export for debugging
window.debugConverter = {
    get converter() { return converter; },
    convertAddress,
    calculateSimilarity,
    setExample,
    initializeConverter
};

// Expose functions to global scope for onclick handlers
window.convertAddress = convertAddress;
window.setExample = setExample;
window.showLoading = showLoading;
window.showError = showError;
window.displayResult = displayResult;
