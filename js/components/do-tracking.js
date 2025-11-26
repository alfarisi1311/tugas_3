// Komponen Tracking Delivery Order
Vue.component('do-tracking', {
    template: `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Tracking Delivery Order (DO)</h2>
                <button class="btn btn-primary" @click="$emit('tambah-do')">
                    <i class="fas fa-plus"></i> Tambah DO Baru
                </button>
            </div>
            
            <div class="filter-section">
                <div class="search-box">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Cari berdasarkan Nomor DO atau NIM..." 
                        v-model="searchTerm"
                        @keyup.enter="handleSearch"
                        @keyup.esc="resetSearch"
                    >
                    <i class="fas fa-search"></i>
                </div>
            </div>
            
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nomor DO</th>
                            <th>NIM</th>
                            <th>Nama</th>
                            <th>Ekspedisi</th>
                            <th>Paket Bahan Ajar</th>
                            <th>Tanggal Kirim</th>
                            <th>Total Harga</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="doItem in filteredDo" :key="doItem.nomorDO">
                            <td>{{ doItem.nomorDO }}</td>
                            <td>{{ doItem.nim }}</td>
                            <td>{{ doItem.nama }}</td>
                            <td>{{ doItem.ekspedisi }}</td>
                            <td>
                                <strong>{{ doItem.paket }}</strong>
                            </td>
                            <td>{{ formatDate(doItem.tanggalKirim) }}</td>
                            <td>{{ formatCurrency(doItem.total) }}</td>
                            <td>
                                <span class="badge" :class="getDoStatusClass(doItem)">
                                    {{ doItem.status }}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-primary btn-sm" @click="$emit('lihat-detail', doItem)">
                                    <i class="fas fa-eye"></i> Detail
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="empty-state" v-if="filteredDo.length === 0">
                    <i class="fas fa-shipping-fast"></i>
                    <h3>Tidak ada data DO yang sesuai dengan pencarian</h3>
                </div>
            </div>
        </div>
    `,
    props: {
        trackingData: Array,
        paketList: Array,
        upbjjList: Array
    },
    data() {
        return {
            searchTerm: ''
        };
    },
    computed: {
        filteredDo() {
            if (!this.searchTerm) return this.trackingData;
            
            const searchTerm = this.searchTerm.toLowerCase();
            return this.trackingData.filter(doItem => 
                doItem.nomorDO.toLowerCase().includes(searchTerm) || 
                doItem.nim.toLowerCase().includes(searchTerm)
            );
        }
    },
    methods: {
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
        getDoStatusClass(doItem) {
            if (doItem.status === 'Selesai') return 'badge-success';
            if (doItem.status === 'Dalam Perjalanan') return 'badge-warning';
            return 'badge-danger';
        },
        handleSearch() {
            // Pencarian dilakukan oleh computed property
        },
        resetSearch() {
            this.searchTerm = '';
        }
    }
});