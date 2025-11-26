// Aplikasi Vue.js utama
const app = new Vue({
    el: '#app',
    data: {
        currentTab: 'stok',
        
        // Data dari JSON
        upbjjList: [],
        kategoriList: [],
        pengirimanList: [],
        paketList: [],
        stokData: [],
        trackingData: [],
        
        // Modal states
        showAddStockModal: false,
        showEditStockModal: false,
        showAddDoModal: false,
        showDoTrackingModal: false,
        showDeleteConfirmModal: false,
        
        // Form data
        stockForm: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ''
        },
        doForm: {
            nomorDO: '',
            nim: '',
            nama: '',
            ekspedisi: '',
            paket: '',
            tanggalKirim: '',
            totalHarga: 0
        },
        newStatus: {
            keterangan: ''
        },
        
        // Selected items
        selectedStock: {},
        selectedDo: {},
        selectedDoPaket: null
    },
    async created() {
        // Load data dari JSON
        await this.loadData();
        
        // Set default DO form values
        this.doForm.nomorDO = ApiService.generateDoNumber(this.trackingData);
        this.doForm.tanggalKirim = this.getCurrentDate();
    },
    methods: {
        async loadData() {
            const data = await ApiService.loadData();
            this.upbjjList = data.upbjjList;
            this.kategoriList = data.kategoriList;
            this.pengirimanList = data.pengirimanList;
            this.paketList = data.paket;
            this.stokData = data.stok;
            this.trackingData = data.tracking;
        },
        
        // Utility methods
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
        },
        formatDate(dateString) {
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', options);
        },
        formatDateTime(dateString) {
            if (!dateString) return '';
            const options = { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            const date = new Date(dateString.replace(' ', 'T'));
            return date.toLocaleDateString('id-ID', options);
        },
        getCurrentDate() {
            return new Date().toISOString().split('T')[0];
        },
        getCurrentDateTime() {
            const now = new Date();
            return now.toISOString().replace('T', ' ').substring(0, 19);
        },
        
        // Stock methods
        handleEditStock(item) {
            this.stockForm = { ...item };
            this.showEditStockModal = true;
        },
        handleDeleteStock(item) {
            this.selectedStock = item;
            this.showDeleteConfirmModal = true;
        },
        closeStockModal() {
            this.showAddStockModal = false;
            this.showEditStockModal = false;
            this.stockForm = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        },
        submitStockForm() {
            if (this.showEditStockModal) {
                // Update existing stock
                const index = this.stokData.findIndex(item => item.kode === this.stockForm.kode);
                if (index !== -1) {
                    this.stokData.splice(index, 1, { ...this.stockForm });
                }
            } else {
                // Add new stock
                // Cek apakah kode sudah ada
                const existingIndex = this.stokData.findIndex(item => item.kode === this.stockForm.kode);
                if (existingIndex === -1) {
                    this.stokData.push({ ...this.stockForm });
                } else {
                    alert('Kode mata kuliah sudah ada!');
                    return;
                }
            }
            this.closeStockModal();
            ApiService.saveStok(this.stokData);
        },
        deleteStock() {
            this.stokData = this.stokData.filter(item => item.kode !== this.selectedStock.kode);
            this.showDeleteConfirmModal = false;
            ApiService.saveStok(this.stokData);
        },
        
        // DO methods
        updateDoPaketDetail() {
            if (this.doForm.paket) {
                this.selectedDoPaket = this.paketList.find(paket => paket.kode === this.doForm.paket);
                this.doForm.totalHarga = this.selectedDoPaket ? this.selectedDoPaket.harga : 0;
            } else {
                this.selectedDoPaket = null;
                this.doForm.totalHarga = 0;
            }
        },
        submitDoForm() {
            const selectedPaket = this.paketList.find(paket => paket.kode === this.doForm.paket);
            
            if (!selectedPaket) {
                alert('Pilih paket yang valid!');
                return;
            }
            
            const newDo = {
                nomorDO: this.doForm.nomorDO,
                nim: this.doForm.nim,
                nama: this.doForm.nama,
                status: 'Dalam Perjalanan',
                ekspedisi: this.doForm.ekspedisi,
                tanggalKirim: this.doForm.tanggalKirim,
                paket: this.doForm.paket,
                total: this.doForm.totalHarga,
                currentStep: 0,
                perjalanan: [
                    {
                        waktu: this.getCurrentDateTime(),
                        keterangan: 'Penerimaan di Loket: UT PUSAT'
                    },
                    {
                        waktu: '',
                        keterangan: 'Pesanan dikemas dan siap dikirim'
                    },
                    {
                        waktu: '',
                        keterangan: 'Pesanan dikirim ke alamat tujuan'
                    },
                    {
                        waktu: '',
                        keterangan: 'Pesanan diterima oleh penerima'
                    }
                ]
            };
            
            this.trackingData.push(newDo);
            this.showAddDoModal = false;
            
            // Reset form dan generate nomor DO baru
            this.doForm = {
                nomorDO: ApiService.generateDoNumber(this.trackingData),
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: this.getCurrentDate(),
                totalHarga: 0
            };
            this.selectedDoPaket = null;
            
            ApiService.saveTracking(this.trackingData);
            alert('Delivery Order berhasil ditambahkan!');
        },
        handleViewTracking(doItem) {
            this.selectedDo = { ...doItem };
            this.showDoTrackingModal = true;
        },
        getStepIcon(index) {
            const icons = ['fa-clipboard-check', 'fa-box', 'fa-shipping-fast', 'fa-home'];
            return icons[index] || 'fa-circle';
        },
        addTrackingStatus() {
            if (this.newStatus.keterangan.trim() === '') {
                alert('Keterangan status tidak boleh kosong!');
                return;
            }
            
            const nextStep = this.selectedDo.currentStep + 1;
            if (nextStep < this.selectedDo.perjalanan.length) {
                this.selectedDo.perjalanan[nextStep].waktu = this.getCurrentDateTime();
                this.selectedDo.perjalanan[nextStep].keterangan = this.newStatus.keterangan;
                this.selectedDo.currentStep = nextStep;
                
                if (nextStep === this.selectedDo.perjalanan.length - 1) {
                    this.selectedDo.status = 'Selesai';
                }
                
                // Update in main data
                const index = this.trackingData.findIndex(item => item.nomorDO === this.selectedDo.nomorDO);
                if (index !== -1) {
                    this.trackingData.splice(index, 1, { ...this.selectedDo });
                }
                
                this.newStatus.keterangan = '';
                ApiService.saveTracking(this.trackingData);
                alert('Status tracking berhasil ditambahkan!');
            } else {
                alert('Semua status tracking sudah terisi!');
            }
        },
        
        // Order methods
        handleSubmitOrder(orderData) {
            const selectedPaket = this.paketList.find(paket => paket.kode === orderData.paket);
            const totalHarga = selectedPaket ? selectedPaket.harga : 0;
            
            alert(`Pesanan berhasil dikirim!\n\nNIM: ${orderData.nim}\nNama: ${orderData.nama}\nUT-Daerah: ${orderData.upbjj}\nPaket: ${orderData.paket}\nTotal Harga: ${this.formatCurrency(totalHarga)}`);
            console.log('Order submitted:', orderData);
        }
    }
});