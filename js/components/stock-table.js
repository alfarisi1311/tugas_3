// Komponen Tabel Stok Bahan Ajar
Vue.component('ba-stock-table', {
    template: `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Stok Bahan Ajar</h2>
                <button class="btn btn-primary" @click="$emit('tambah-stok')">
                    <i class="fas fa-plus"></i> Tambah Stok Baru
                </button>
            </div>
            
            <div class="filter-section">
                <div class="filter-row">
                    <div class="filter-group">
                        <label for="filter-upbjj">UT-Daerah</label>
                        <select id="filter-upbjj" class="form-control" v-model="filters.upbjj">
                            <option value="">Semua UT-Daerah</option>
                            <option v-for="upbjj in upbjjList" :value="upbjj">{{ upbjj }}</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="filter-kategori">Kategori Mata Kuliah</label>
                        <select id="filter-kategori" class="form-control" v-model="filters.kategori" :disabled="!filters.upbjj">
                            <option value="">Semua Kategori</option>
                            <option v-for="kategori in filteredKategori" :value="kategori">{{ kategori }}</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="filter-stok">Status Stok</label>
                        <select id="filter-stok" class="form-control" v-model="filters.statusStok">
                            <option value="">Semua Status</option>
                            <option value="aman">Aman</option>
                            <option value="menipis">Menipis</option>
                            <option value="kosong">Kosong</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="sort-by">Urutkan Berdasarkan</label>
                        <select id="sort-by" class="form-control" v-model="sortBy">
                            <option value="judul">Judul Mata Kuliah</option>
                            <option value="qty">Jumlah Stok</option>
                            <option value="harga">Harga</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <button class="btn btn-light" @click="resetFilters">
                            <i class="fas fa-redo"></i> Reset Filter
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Kode/Judul Mata Kuliah</th>
                            <th>Kategori</th>
                            <th>UT-Daerah</th>
                            <th>Lokasi Rak</th>
                            <th>Harga</th>
                            <th>Jumlah Stok</th>
                            <th>Safety Stock</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredStok" :key="item.kode">
                            <td>
                                <strong>{{ item.kode }}</strong><br>
                                {{ item.judul }}
                            </td>
                            <td>{{ item.kategori }}</td>
                            <td>{{ item.upbjj }}</td>
                            <td>{{ item.lokasiRak }}</td>
                            <td>{{ formatCurrency(item.harga) }}</td>
                            <td>{{ item.qty }} buah</td>
                            <td>{{ item.safety }} buah</td>
                            <td>
                                <div class="tooltip">
                                    <status-badge :item="item"></status-badge>
                                    <div class="tooltip-text" v-html="item.catatanHTML"></div>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm" @click="$emit('edit-stok', item)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" @click="$emit('hapus-stok', item)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="empty-state" v-if="filteredStok.length === 0">
                    <i class="fas fa-box-open"></i>
                    <h3>Tidak ada data stok yang sesuai dengan filter</h3>
                </div>
            </div>
        </div>
    `,
    props: {
        stokData: Array,
        upbjjList: Array,
        kategoriList: Array
    },
    data() {
        return {
            filters: {
                upbjj: '',
                kategori: '',
                statusStok: ''
            },
            sortBy: 'judul'
        };
    },
    computed: {
        filteredKategori() {
            if (!this.filters.upbjj) return this.kategoriList;
            
            const stokByUpbjj = this.stokData.filter(item => item.upbjj === this.filters.upbjj);
            const kategoriSet = new Set(stokByUpbjj.map(item => item.kategori));
            return Array.from(kategoriSet);
        },
        filteredStok() {
            let filtered = [...this.stokData];
            
            // Filter by UT-Daerah
            if (this.filters.upbjj) {
                filtered = filtered.filter(item => item.upbjj === this.filters.upbjj);
            }
            
            // Filter by kategori
            if (this.filters.kategori) {
                filtered = filtered.filter(item => item.kategori === this.filters.kategori);
            }
            
            // Filter by status stok
            if (this.filters.statusStok) {
                if (this.filters.statusStok === 'aman') {
                    filtered = filtered.filter(item => item.qty >= item.safety);
                } else if (this.filters.statusStok === 'menipis') {
                    filtered = filtered.filter(item => item.qty < item.safety && item.qty > 0);
                } else if (this.filters.statusStok === 'kosong') {
                    filtered = filtered.filter(item => item.qty === 0);
                }
            }
            
            // Sort data
            if (this.sortBy === 'judul') {
                filtered = filtered.sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.sortBy === 'qty') {
                filtered = filtered.sort((a, b) => b.qty - a.qty);
            } else if (this.sortBy === 'harga') {
                filtered = filtered.sort((a, b) => b.harga - a.harga);
            }
            
            return filtered;
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
        resetFilters() {
            this.filters = {
                upbjj: '',
                kategori: '',
                statusStok: ''
            };
            this.sortBy = 'judul';
        }
    }
});