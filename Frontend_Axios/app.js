// ============================================================================
// BÀI TẬP THỰC HÀNH SỐ 2 - CLIENT GỌI API BẰNG THƯ VIỆN AXIOS
// Đầy đủ 4 phương thức: GET, POST, PUT, DELETE
// ============================================================================

let apiClient = createAxiosInstance('http://localhost:5000/api');

function createAxiosInstance(baseURL) {
    const instance = axios.create({
        baseURL: baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    // Interceptor ghi log khi gửi Request
    instance.interceptors.request.use(config => {
        const method = config.method.toUpperCase();
        const url = `${config.baseURL}${config.url}`;
        appendLog(method, `Gửi request tới ${url}`, config.data ? JSON.stringify(config.data) : null, 'info');
        return config;
    });

    // Interceptor ghi log khi nhận Response
    instance.interceptors.response.use(
        response => {
            const method = response.config.method.toUpperCase();
            appendLog(method, `HTTP ${response.status} OK`, JSON.stringify(response.data), 'success');
            updateServerBadge(true);
            return response;
        },
        error => {
            const status = error.response ? error.response.status : 'NETWORK_ERR';
            const detail = error.response ? JSON.stringify(error.response.data) : error.message;
            appendLog('ERROR', `HTTP ${status}`, detail, 'danger');
            if (!error.response) updateServerBadge(false);
            return Promise.reject(error);
        }
    );

    return instance;
}

function applyBaseUrl() {
    const urlInput = document.getElementById('apiBaseUrl').value.trim().replace(/\/+$/, '');
    apiClient = createAxiosInstance(urlInput);
    fetchAllProducts();
}

// ============================================================================
// 1. PHƯƠNG THỨC GET ALL: Lấy danh sách sản phẩm (GET /api/products)
// ============================================================================
async function fetchAllProducts() {
    try {
        const response = await apiClient.get('/products');
        renderProductTable(response.data);
        return response.data;
    } catch (error) {
        document.getElementById('productTableBody').innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>
                    Không thể kết nối tới Back-end API. Hãy chắc chắn bạn đã chạy <code>dotnet run</code> hoặc <code>run_windows.bat</code>!
                </td>
            </tr>`;
    }
}

// ============================================================================
// 2. PHƯƠNG THỨC GET BY ID: Lấy chi tiết 1 sản phẩm (GET /api/products/{id})
// ============================================================================
async function fetchProductById() {
    const id = document.getElementById('searchIdInput').value;
    const resultBox = document.getElementById('singleProductResult');

    if (!id) {
        resultBox.innerHTML = `<div class="alert alert-warning py-2 mb-0">Vui lòng nhập ID cần tìm.</div>`;
        return;
    }

    try {
        const response = await apiClient.get(`/products/${id}`);
        const p = response.data;
        resultBox.innerHTML = `
            <div class="alert alert-success py-2 mb-0">
                <strong>#${p.id} - ${escapeHtml(p.name)}</strong><br>
                Danh mục: ${escapeHtml(p.category)} | Giá: <b>${formatCurrency(p.price)}</b> | Kho: <b>${p.stock}</b>
            </div>`;
    } catch (error) {
        resultBox.innerHTML = `<div class="alert alert-danger py-2 mb-0">Không tìm thấy sản phẩm có ID = ${id} (HTTP 404).</div>`;
    }
}

// ============================================================================
// 3. PHƯƠNG THỨC POST: Tạo mới sản phẩm (POST /api/products)
// ============================================================================
async function createProduct(payload) {
    const response = await apiClient.post('/products', payload);
    await fetchAllProducts();
    return response.data;
}

// ============================================================================
// 4. PHƯƠNG THỨC PUT: Cập nhật sản phẩm (PUT /api/products/{id})
// ============================================================================
async function updateProduct(id, payload) {
    const response = await apiClient.put(`/products/${id}`, payload);
    await fetchAllProducts();
    return response.data;
}

// ============================================================================
// 5. PHƯƠNG THỨC DELETE: Xóa sản phẩm (DELETE /api/products/{id})
// ============================================================================
async function deleteProductById(id) {
    try {
        await apiClient.delete(`/products/${id}`);
        await fetchAllProducts();
    } catch (error) {
        alert('Lỗi khi xóa sản phẩm ID = ' + id);
    }
}

// ============================================================================
// XỬ LÝ SỰ KIỆN GIAO DIỆN & AUTO-TEST
// ============================================================================
async function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('productId').value;
    const payload = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value.trim() || 'Gaming Gear',
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value, 10)
    };

    try {
        if (id) {
            // Nếu đang ở chế độ Sửa -> Gọi Axios PUT
            payload.id = parseInt(id, 10);
            await updateProduct(id, payload);
        } else {
            // Nếu đang ở chế độ Thêm mới -> Gọi Axios POST
            await createProduct(payload);
        }
        resetForm();
    } catch (error) {
        alert('Có lỗi xảy ra khi lưu sản phẩm. Xem chi tiết dưới Axios Logger.');
    }
}

function loadProductForEdit(product) {
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;

    document.getElementById('formTitle').innerHTML = `<i class="bi bi-pencil-square text-warning me-2"></i>Cập Nhật Sản Phẩm #${product.id} (Axios PUT)`;
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.className = 'btn btn-warning fw-semibold';
    submitBtn.innerHTML = `<i class="bi bi-save-fill me-1"></i>Gửi Request PUT (#${product.id})`;
    document.getElementById('cancelEditBtn').classList.remove('d-none');
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productCategory').value = 'Gaming Gear';
    document.getElementById('formTitle').innerHTML = `<i class="bi bi-plus-circle-fill text-success me-2"></i>Thêm Sản Phẩm Mới (Axios POST)`;
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.className = 'btn btn-success fw-semibold';
    submitBtn.innerHTML = `<i class="bi bi-send-fill me-1"></i>Gửi Request POST`;
    document.getElementById('cancelEditBtn').classList.add('d-none');
}

// Kịch bản tự động kiểm thử cả 4 phương thức Axios
async function runAutomatedTestSuite() {
    appendLog('TEST', '=== BẮT ĐẦU CHẠY AUTO-TEST 4 PHƯƠNG THỨC AXIOS ===', null, 'warning');
    try {
        // B1: POST
        const created = await createProduct({
            name: 'Chuột Logitech G Pro X Superlight (Auto-Test)',
            category: 'Gaming Gear',
            price: 2990000,
            stock: 10
        });
        const newId = created.id;

        // B2: GET by ID
        await apiClient.get(`/products/${newId}`);

        // B3: PUT
        await updateProduct(newId, {
            id: newId,
            name: 'Chuột Logitech G Pro X Superlight 2 (Đã cập nhật qua PUT)',
            category: 'Gaming Gear Pro',
            price: 3490000,
            stock: 20
        });

        // B4: DELETE
        await apiClient.delete(`/products/${newId}`);
        await fetchAllProducts();

        appendLog('TEST', '=== HOÀN TẤT AUTO-TEST: CẢ 4 METHOD POST, GET, PUT, DELETE ĐỀU THÀNH CÔNG! ===', null, 'success');
    } catch (err) {
        appendLog('TEST', 'Auto-Test gặp lỗi. Kiểm tra kết nối Server.', null, 'danger');
    }
}

function renderProductTable(products) {
    const tbody = document.getElementById('productTableBody');
    document.getElementById('productCount').textContent = `${products.length} sản phẩm`;

    if (!products || products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Chưa có sản phẩm nào trong Database.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td class="ps-3 fw-bold text-secondary">#${p.id}</td>
            <td class="fw-semibold">${escapeHtml(p.name)}</td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(p.category)}</span></td>
            <td class="text-end fw-bold text-primary">${formatCurrency(p.price)}</td>
            <td class="text-center">${p.stock}</td>
            <td class="text-end pe-3">
                <button class="btn btn-sm btn-outline-warning me-1" title="Sửa (PUT)" onclick='loadProductForEdit(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
                    <i class="bi bi-pencil-square"></i> PUT
                </button>
                <button class="btn btn-sm btn-outline-danger" title="Xóa (DELETE)" onclick="deleteProductById(${p.id})">
                    <i class="bi bi-trash"></i> DELETE
                </button>
            </td>
        </tr>
    `).join('');
}

function appendLog(method, message, payload, type) {
    const logger = document.getElementById('axiosLogger');
    const time = new Date().toLocaleTimeString('vi-VN');
    const badgeColor = {
        'GET': 'bg-primary',
        'POST': 'bg-success',
        'PUT': 'bg-warning text-dark',
        'DELETE': 'bg-danger',
        'TEST': 'bg-info text-dark',
        'ERROR': 'bg-danger'
    }[method] || 'bg-secondary';

    const textClass = type === 'danger' ? 'text-danger' : (type === 'success' ? 'text-success' : 'text-light');

    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `
        <span class="text-secondary">[${time}]</span>
        <span class="badge ${badgeColor} badge-method mx-1">${method}</span>
        <span class="${textClass}">${escapeHtml(message)}</span>
        ${payload ? `<div class="text-secondary ms-4 mt-1" style="font-size:0.76rem; word-break:break-all;">Payload: ${escapeHtml(payload)}</div>` : ''}
    `;
    logger.appendChild(div);
    logger.scrollTop = logger.scrollHeight;
}

function clearLogs() {
    document.getElementById('axiosLogger').innerHTML = '';
}

function updateServerBadge(isOnline) {
    const badge = document.getElementById('serverStatus');
    if (isOnline) {
        badge.className = 'badge bg-success';
        badge.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>API Online (localhost:5000)';
    } else {
        badge.className = 'badge bg-danger';
        badge.innerHTML = '<i class="bi bi-x-circle-fill me-1"></i>API Offline';
    }
}

function formatCurrency(val) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Khởi chạy lần đầu khi mở trang
window.addEventListener('DOMContentLoaded', () => {
    fetchAllProducts();
});
