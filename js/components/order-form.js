// Komponen Form Pemesanan
Vue.component('order-form', {
    template: `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Formulir Pemesanan Bahan Ajar</h2>
            </div>
            
            <div class="card-body">
                <form @submit.prevent="submitOrder">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="order-nim">NIM</label>
                            <input type="text" id="order-nim" class="form-control" v-model="orderForm.nim" required 
                                   pattern="[0-9]{9}" title="NIM harus 9 digit angka">
                        </div>
                        <div class="form-group">
                            <label for="order-nama">Nama Lengkap</label>
                            <input type="text" id="order-nama" class="form-control" v-model="orderForm.nama" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="order-upbjj">UT-Daerah</label>
                            <select id="order-upbjj" class="form-control" v-model="orderForm.upbjj" required>
                                <option value="">Pilih UT-Daerah</option>
                                <option v-for="upbjj in upbjjList" :value="upbjj">{{ upbjj }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="order-paket">Paket Bahan Ajar</label>
                            <select id="order-paket" class="form-control" v-model="orderForm.paket" required @change="updatePaketDetail">
                                <option value="">Pilih Paket</option>
                                <option v-for="paket in paketList" :value="paket.kode">{{ paket.kode }} - {{ paket.nama }}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group" v-if="selectedPaket">
                        <label>Detail Paket:</label>
                        <div class="card" style="padding: 1rem; background-color: #f8f9fa;">
                            <p><strong>{{ selectedPaket.nama }}</strong></p>
                            <p><strong>Kode:</strong> {{ selectedPaket.kode }}</p>
                            <p><strong>Isi Paket:</strong> {{ selectedPaket.isi.join(', ') }}</p>
                            <p><strong>Harga:</strong> {{ formatCurrency(selectedPaket.harga) }}</p>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="order-catatan">Catatan (Opsional)</label>
                        <textarea id="order-catatan" class="form-control" v-model="orderForm.catatan" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-paper-plane"></i> Kirim Pesanan
                        </button>
                        <button type="button" class="btn btn-light" @click="resetForm">
                            <i class="fas fa-redo"></i> Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    props: {
        paketList: Array,
        upbjjList: Array
    },
    data() {
        return {
            orderForm: {
                nim: '',
                nama: '',
                upbjj: '',
                paket: '',
                catatan: ''
            },
            selectedPaket: null
        };
    },
    methods: {
        updatePaketDetail() {
            if (this.orderForm.paket) {
                this.selectedPaket = this.paketList.find(paket => paket.kode === this.orderForm.paket);
            } else {
                this.selectedPaket = null;
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
        },
        submitOrder() {
            // Validasi NIM
            if (!/^[0-9]{9}$/.test(this.orderForm.nim)) {
                alert('NIM harus terdiri dari 9 digit angka!');
                return;
            }
            
            this.$emit('submit-order', { ...this.orderForm });
            this.resetForm();
        },
        resetForm() {
            this.orderForm = {
                nim: '',
                nama: '',
                upbjj: '',
                paket: '',
                catatan: ''
            };
            this.selectedPaket = null;
        }
    }
});