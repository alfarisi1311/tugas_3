// Komponen Badge Status Stok
Vue.component('status-badge', {
    template: `
        <span class="badge" :class="statusClass">
            {{ statusText }}
        </span>
    `,
    props: {
        item: Object
    },
    computed: {
        statusClass() {
            if (this.item.qty === 0) return 'badge-danger';
            if (this.item.qty < this.item.safety) return 'badge-warning';
            return 'badge-success';
        },
        statusText() {
            if (this.item.qty === 0) return 'Kosong';
            if (this.item.qty < this.item.safety) return 'Menipis';
            return 'Aman';
        }
    }
});