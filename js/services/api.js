// Service untuk mengambil data dari JSON
const ApiService = {
    async loadData() {
        try {
            const response = await fetch('./data/dataBahanAjar.json');
            const data = await response.json();
            
            // Transform tracking data untuk memudahkan penggunaan
            const transformedTracking = data.tracking.map(item => {
                const key = Object.keys(item)[0];
                return {
                    nomorDO: key,
                    ...item[key],
                    currentStep: this.calculateCurrentStep(item[key].perjalanan)
                };
            });
            
            return {
                ...data,
                tracking: transformedTracking
            };
        } catch (error) {
            console.error('Error loading data:', error);
            return {
                upbjjList: [],
                kategoriList: [],
                pengirimanList: [],
                paket: [],
                stok: [],
                tracking: []
            };
        }
    },

    calculateCurrentStep(perjalanan) {
        // Hitung step berdasarkan perjalanan yang sudah ada waktu
        return perjalanan.filter(step => step.waktu && step.waktu.trim() !== '').length - 1;
    },

    // Simulasi API calls untuk operasi CRUD
    async saveStok(stokData) {
        // Dalam implementasi nyata, ini akan menyimpan ke backend
        console.log('Saving stok data:', stokData);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    },

    async saveTracking(trackingData) {
        // Dalam implementasi nyata, ini akan menyimpan ke backend
        console.log('Saving tracking data:', trackingData);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    },

    // Generate nomor DO baru
    generateDoNumber(trackingData) {
        const year = new Date().getFullYear();
        let highestNumber = 0;
        
        trackingData.forEach(item => {
            const match = item.nomorDO.match(/DO(\d+)-(\d+)/);
            if (match && match[2]) {
                const number = parseInt(match[2]);
                if (number > highestNumber) {
                    highestNumber = number;
                }
            }
        });
        
        const newNumber = highestNumber + 1;
        return `DO${year}-${newNumber.toString().padStart(4, '0')}`;
    }
};