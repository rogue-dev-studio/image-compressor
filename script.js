// Image Compressor App
class ImageCompressor {
    constructor() {
        this.images = [];
        this.results = [];
        this.settings = {
            quality: 80,
            maxWidth: null,
            maxHeight: null,
            outputFormat: 'original',
            preserveMetadata: true
        };
        this.toastTimeout = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');

        // Settings elements
        this.settingsSection = document.getElementById('settingsSection');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');
        this.maxWidth = document.getElementById('maxWidth');
        this.maxHeight = document.getElementById('maxHeight');
        this.outputFormat = document.getElementById('outputFormat');
        this.preserveMetadata = document.getElementById('preserveMetadata');

        // Action buttons
        this.compressAllBtn = document.getElementById('compressAllBtn');
        this.resetSettingsBtn = document.getElementById('resetSettingsBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
        this.clearResultsBtn = document.getElementById('clearResultsBtn');

        // Sections
        this.imagesSection = document.getElementById('imagesSection');
        this.imagesGrid = document.getElementById('imagesGrid');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.resultsSummary = document.getElementById('resultsSummary');

        // Other elements
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    bindEvents() {
        // Upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Settings events
        this.qualitySlider.addEventListener('input', this.updateQualityDisplay.bind(this));
        this.compressAllBtn.addEventListener('click', this.compressAllImages.bind(this));
        this.resetSettingsBtn.addEventListener('click', this.resetSettings.bind(this));

        // Image management events
        this.selectAllBtn.addEventListener('click', this.selectAllImages.bind(this));
        this.clearAllBtn.addEventListener('click', this.clearAllImages.bind(this));

        // Results events
        this.downloadAllBtn.addEventListener('click', this.downloadAllResults.bind(this));
        this.clearResultsBtn.addEventListener('click', this.clearResults.bind(this));

        // Footer events
        document.getElementById('shareButton').addEventListener('click', this.shareApp.bind(this));
        document.getElementById('exportButton').addEventListener('click', this.exportSettings.bind(this));
        document.getElementById('importButton').addEventListener('click', this.importSettings.bind(this));
    }

    // File handling methods
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    async processFiles(files) {
        if (files.length === 0) return;

        this.showProgress();
        this.images = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const imageData = await this.loadImageFile(file);
                this.images.push(imageData);
                this.updateProgress((i + 1) / files.length * 100);
            } catch (error) {
                console.error('Error loading image:', error);
                this.showToast(`Error loading ${file.name}`, 'error');
            }
        }

        this.hideProgress();
        this.displayImages();
        this.showSettings();
        this.showToast(`${files.length} gambar berhasil dimuat`, 'success');
    }

    loadImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                resolve({
                    id: `image_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                    file: file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: e.target.result,
                    image: img,
                    width: img.width,
                    height: img.height,
                    selected: true
                });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Display methods
    displayImages() {
        if (this.images.length === 0) {
            this.imagesSection.style.display = 'none';
            return;
        }

        this.imagesSection.style.display = 'block';
        this.imagesGrid.innerHTML = '';

        this.images.forEach(imageData => {
            const imageCard = this.createImageCard(imageData);
            this.imagesGrid.appendChild(imageCard);
        });
    }

    createImageCard(imageData) {
        const card = document.createElement('div');
        card.className = 'image-card fade-in';
        card.innerHTML = `
            <input type="checkbox" class="image-checkbox" ${imageData.selected ? 'checked' : ''} 
                   onchange="imageCompressor.toggleImageSelection('${imageData.id}')">
            <img src="${imageData.url}" alt="${imageData.name}" class="image-preview">
            <div class="image-info">
                <div class="image-name">${imageData.name}</div>
                <div class="image-details">
                    <div>Ukuran: ${this.formatFileSize(imageData.size)}</div>
                    <div>Dimensi: ${imageData.width} × ${imageData.height}px</div>
                    <div>Format: ${imageData.type}</div>
                </div>
                <div class="image-actions">
                    <button class="action-button" onclick="imageCompressor.compressSingleImage('${imageData.id}')">
                        <i data-lucide="minimize-2" class="btn-icon" aria-hidden="true"></i>
                        Kompres
                    </button>
                    <button class="action-button secondary" onclick="imageCompressor.removeImage('${imageData.id}')">
                        <i data-lucide="trash-2" class="btn-icon" aria-hidden="true"></i>
                        Hapus
                    </button>
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return card;
    }

    displayResults() {
        if (this.results.length === 0) {
            this.resultsSection.style.display = 'none';
            return;
        }

        this.resultsSection.style.display = 'block';
        this.updateResultsSummary();
        this.resultsGrid.innerHTML = '';

        this.results.forEach(result => {
            const resultCard = this.createResultCard(result);
            this.resultsGrid.appendChild(resultCard);
        });
        if (window.lucide) lucide.createIcons();
    }

    createResultCard(result) {
        const compressionRatio = ((result.originalSize - result.compressedSize) / result.originalSize * 100).toFixed(1);
        let ratioClass;
        if (compressionRatio > 50) {
            ratioClass = 'success';
        } else if (compressionRatio > 20) {
            ratioClass = 'warning';
        } else {
            ratioClass = 'error';
        }
        
        const card = document.createElement('div');
        card.className = 'result-card fade-in';
        card.innerHTML = `
            <div class="compression-ratio ${ratioClass}">-${compressionRatio}%</div>
            <img src="${result.url}" alt="${result.name}" class="result-preview">
            <div class="result-info">
                <div class="result-name">${result.name}</div>
                <div class="result-details">
                    <div>Asli: ${this.formatFileSize(result.originalSize)}</div>
                    <div>Kompres: ${this.formatFileSize(result.compressedSize)}</div>
                    <div>Dimensi: ${result.width} × ${result.height}px</div>
                    <div>Format: ${result.type}</div>
                </div>
                <div class="result-actions">
                    <button class="primary-button" onclick="imageCompressor.downloadResult('${result.id}')">
                        <i data-lucide="download" class="btn-icon" aria-hidden="true"></i>
                        Download
                    </button>
                    <button class="action-button" onclick="imageCompressor.previewResult('${result.id}')">
                        <i data-lucide="eye" class="btn-icon" aria-hidden="true"></i>
                        Preview
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    updateResultsSummary() {
        if (this.results.length === 0) return;

        const totalOriginal = this.results.reduce((sum, result) => sum + result.originalSize, 0);
        const totalCompressed = this.results.reduce((sum, result) => sum + result.compressedSize, 0);
        const totalSaved = totalOriginal - totalCompressed;
        const averageCompression = (totalSaved / totalOriginal * 100).toFixed(1);

        this.resultsSummary.innerHTML = `
            <div class="summary-stats">
                <div class="stat-item">
                    <span class="stat-value">${this.results.length}</span>
                    <div class="stat-label">Gambar Diproses</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatFileSize(totalOriginal)}</span>
                    <div class="stat-label">Ukuran Asli</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatFileSize(totalCompressed)}</span>
                    <div class="stat-label">Ukuran Kompres</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.formatFileSize(totalSaved)}</span>
                    <div class="stat-label">Ruangan Tersimpan</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${averageCompression}%</span>
                    <div class="stat-label">Rata-rata Kompresi</div>
                </div>
            </div>
        `;
    }

    // Compression methods
    async compressAllImages() {
        const selectedImages = this.images.filter(img => img.selected);
        if (selectedImages.length === 0) {
            this.showToast('Pilih minimal satu gambar untuk dikompres', 'warning');
            return;
        }

        this.showLoading('Memproses gambar...');
        
        try {
            for (let i = 0; i < selectedImages.length; i++) {
                const imageData = selectedImages[i];
                this.loadingText.textContent = `Memproses ${i + 1} dari ${selectedImages.length} gambar...`;
                
                const result = await this.compressImage(imageData);
                this.results.push(result);
            }
            
            this.hideLoading();
            this.displayResults();
            this.showToast(`${selectedImages.length} gambar berhasil dikompres`, 'success');
        } catch (error) {
            this.hideLoading();
            console.error('Compression error:', error);
            this.showToast('Terjadi kesalahan saat kompresi: ' + error.message, 'error');
        }
    }

    async compressSingleImage(imageId) {
        const imageData = this.images.find(img => img.id === imageId);
        if (!imageData) {
            this.showToast('Gambar tidak ditemukan', 'error');
            return;
        }

        this.showLoading('Memproses gambar...');
        
        try {
            const result = await this.compressImage(imageData);
            this.results.push(result);
            this.hideLoading();
            this.displayResults();
            this.showToast('Gambar berhasil dikompres', 'success');
        } catch (error) {
            this.hideLoading();
            console.error('Compression error:', error);
            this.showToast('Terjadi kesalahan saat kompresi: ' + error.message, 'error');
        }
    }

    compressImage(imageData) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions
            let { width, height } = this.calculateDimensions(imageData.width, imageData.height);
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image
            ctx.drawImage(imageData.image, 0, 0, width, height);
            
            // Determine output format
            const outputFormat = this.getOutputFormat(imageData.type);
            const mimeType = `image/${outputFormat}`;
            
            // Compress
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Failed to compress image'));
                    return;
                }
                
                const url = URL.createObjectURL(blob);
                const result = {
                    id: `result_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                    name: this.getOutputFileName(imageData.name, outputFormat),
                    url: url,
                    blob: blob,
                    type: mimeType,
                    width: width,
                    height: height,
                    originalSize: imageData.size,
                    compressedSize: blob.size
                };
                
                resolve(result);
            }, mimeType, this.settings.quality / 100);
        });
    }

    calculateDimensions(originalWidth, originalHeight) {
        let width = originalWidth;
        let height = originalHeight;
        
        const maxWidth = this.settings.maxWidth;
        const maxHeight = this.settings.maxHeight;
        
        if (maxWidth && width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (maxHeight && height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    getOutputFormat(originalType) {
        if (this.settings.outputFormat === 'original') {
            return originalType.split('/')[1];
        }
        return this.settings.outputFormat;
    }

    getOutputFileName(originalName, outputFormat) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        return `${nameWithoutExt}_compressed.${outputFormat}`;
    }

    // Image management methods
    toggleImageSelection(imageId) {
        const imageData = this.images.find(img => img.id === imageId);
        if (imageData) {
            imageData.selected = !imageData.selected;
        }
    }

    selectAllImages() {
        this.images.forEach(img => img.selected = true);
        this.displayImages();
        this.showToast('Semua gambar dipilih', 'success');
    }

    clearAllImages() {
        this.images = [];
        this.displayImages();
        this.settingsSection.style.display = 'none';
        this.showToast('Semua gambar dihapus', 'success');
    }

    removeImage(imageId) {
        const initialLength = this.images.length;
        this.images = this.images.filter(img => img.id !== imageId);
        
        if (this.images.length === initialLength) {
            this.showToast('Gambar tidak ditemukan', 'error');
            return;
        }
        
        this.displayImages();
        if (this.images.length === 0) {
            this.settingsSection.style.display = 'none';
        }
        this.showToast('Gambar dihapus', 'success');
    }


    // Results management methods
    downloadResult(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (!result) {
            this.showToast('File tidak ditemukan', 'error');
            return;
        }

        const link = document.createElement('a');
        link.href = result.url;
        link.download = result.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('File berhasil didownload', 'success');
    }

    downloadAllResults() {
        if (this.results.length === 0) {
            this.showToast('Tidak ada hasil untuk didownload', 'warning');
            return;
        }

        this.results.forEach((result, index) => {
            setTimeout(() => {
                this.downloadResult(result.id);
            }, index * 500);
        });
        
        this.showToast(`Downloading ${this.results.length} file...`, 'success');
    }

    previewResult(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (!result) {
            this.showToast('Gambar tidak ditemukan', 'error');
            return;
        }

        this.createPreviewModal(
            result.name, 
            result.url, 
            result.width, 
            result.height, 
            result.compressedSize,
            result.originalSize
        );
    }

    createPreviewModal(name, url, width, height, size, originalSize = null) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.preview-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal for preview
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            backdrop-filter: blur(5px);
        `;
        
        let compressionInfo;
        if (originalSize) {
            const savedSize = originalSize - size;
            const savedPercentage = (savedSize / originalSize * 100).toFixed(1);
            compressionInfo = `
                <div><strong>Ukuran Asli:</strong> ${this.formatFileSize(originalSize)}</div>
                <div><strong>Ukuran Kompres:</strong> ${this.formatFileSize(size)}</div>
                <div><strong>Penghematan:</strong> ${this.formatFileSize(savedSize)} (${savedPercentage}%)</div>
            `;
        } else {
            compressionInfo = `<div><strong>Ukuran:</strong> ${this.formatFileSize(size)}</div>`;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${name}</h3>
                    <button class="modal-close" onclick="this.closest('.preview-modal').remove()" aria-label="Tutup">&times;</button>
                </div>
                
                <div class="modal-info">
                    <div><strong>Dimensi:</strong> ${width} × ${height}px</div>
                    ${compressionInfo}
                </div>
                
                <div class="modal-image-container">
                    <img src="${url}" class="modal-image" alt="${name}">
                </div>
                
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-primary" onclick="
                        const link = document.createElement('a');
                        link.href = '${url}';
                        link.download = '${name}';
                        link.click();
                        this.closest('.preview-modal').remove();
                    ">
                        <i data-lucide="download" aria-hidden="true"></i>
                        Download
                    </button>
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.preview-modal').remove()">
                        <i data-lucide="x" aria-hidden="true"></i>
                        Tutup
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Close modal with Escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        // Remove event listener when modal is removed
        modal.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeyDown);
        });
    }


    clearResults() {
        // Clean up blob URLs
        this.results.forEach(result => {
            URL.revokeObjectURL(result.url);
        });
        
        this.results = [];
        this.displayResults();
        this.showToast('Hasil kompresi dihapus', 'success');
    }

    // Settings methods
    updateQualityDisplay() {
        this.settings.quality = parseInt(this.qualitySlider.value);
        this.qualityValue.textContent = `${this.settings.quality}%`;
        this.saveSettings();
    }

    resetSettings() {
        this.settings = {
            quality: 80,
            maxWidth: null,
            maxHeight: null,
            outputFormat: 'original',
            preserveMetadata: true
        };
        
        this.qualitySlider.value = 80;
        this.qualityValue.textContent = '80%';
        this.maxWidth.value = '';
        this.maxHeight.value = '';
        this.outputFormat.value = 'original';
        this.preserveMetadata.checked = true;
        
        this.saveSettings();
        this.showToast('Pengaturan direset', 'success');
    }

    showSettings() {
        this.settingsSection.style.display = 'block';
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showProgress() {
        this.uploadProgress.style.display = 'flex';
        this.updateProgress(0);
    }

    hideProgress() {
        this.uploadProgress.style.display = 'none';
    }

    updateProgress(percentage) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${Math.round(percentage)}%`;
    }

    showLoading(text = 'Memproses...') {
        this.loadingText.textContent = text;
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    showToast(message, type = 'info') {
        // Clear any existing timeout
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
        
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        
        // Remove any existing classes
        this.toast.classList.remove('show', 'hide');
        
        // Force reflow to ensure the class removal is applied
        this.toast.getBoundingClientRect();
        
        // Add show class
        this.toast.classList.add('show');
        
        // Auto hide after 3 seconds
        this.toastTimeout = setTimeout(() => {
            this.hideToast();
        }, 3000);
    }

    hideToast() {
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            this.toastTimeout = null;
        }
        
        this.toast.classList.remove('show');
        this.toast.classList.add('hide');
        
        // Remove the toast element after animation completes
        setTimeout(() => {
            this.toast.classList.remove('hide');
        }, 300);
    }

    // Storage methods
    saveSettings() {
        localStorage.setItem('imageCompressorSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('imageCompressorSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.qualitySlider.value = this.settings.quality;
            this.qualityValue.textContent = `${this.settings.quality}%`;
            this.maxWidth.value = this.settings.maxWidth || '';
            this.maxHeight.value = this.settings.maxHeight || '';
            this.outputFormat.value = this.settings.outputFormat;
            this.preserveMetadata.checked = this.settings.preserveMetadata;
        }
    }

    // Footer methods
    shareApp() {
        if (navigator.share) {
            navigator.share({
                title: 'Image Compressor',
                text: 'Kompres gambar online gratis dan mudah digunakan',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Link berhasil disalin ke clipboard', 'success');
            });
        }
    }

    exportSettings() {
        const data = {
            settings: this.settings,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image-compressor-settings.json';
        link.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Pengaturan berhasil diekspor', 'success');
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.settings) {
                        this.settings = { ...this.settings, ...data.settings };
                        this.saveSettings();
                        this.loadSettings();
                        this.showToast('Pengaturan berhasil diimpor', 'success');
                    }
                } catch (error) {
                    console.error('Import settings error:', error);
                    this.showToast('File pengaturan tidak valid: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}


// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageCompressor = new ImageCompressor();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
