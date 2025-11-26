// Komponen Modal Reusable
Vue.component('app-modal', {
    template: `
        <div class="modal-overlay">
            <div class="modal" :class="{ large: size === 'large' }">
                <div class="modal-header">
                    <h3 class="modal-title">{{ title }}</h3>
                    <button class="modal-close" @click="$emit('close')">&times;</button>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer" v-if="$slots.footer || showDefaultFooter">
                    <slot name="footer">
                        <button class="btn btn-light" @click="$emit('close')">Batal</button>
                        <button class="btn btn-primary" @click="$emit('submit')">Simpan</button>
                    </slot>
                </div>
            </div>
        </div>
    `,
    props: {
        title: String,
        size: {
            type: String,
            default: 'normal'
        },
        showDefaultFooter: {
            type: Boolean,
            default: true
        }
    }
});