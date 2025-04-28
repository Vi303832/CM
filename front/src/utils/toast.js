import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: "rounded-lg shadow-md",
};

export const showToast = {
    success: (message) => {
        toast.success(message, {
            ...toastConfig,
            style: {
                background: '#ffffff',
                borderLeft: '4px solid #4caf50',
                color: '#333333',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px'
            },
            icon: "🟢" // Basit bir emoji veya karakter kullanabilirsiniz
        });
    },
    error: (message) => {
        toast.error(message, {
            ...toastConfig,
            style: {
                background: '#ffffff',
                borderLeft: '4px solid #f44336',
                color: '#333333',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px'
            },
            icon: "🔴"
        });
    },
    warning: (message) => {
        toast.warning(message, {
            ...toastConfig,
            style: {
                background: '#ffffff',
                borderLeft: '4px solid #ff9800',
                color: '#333333',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px'
            },
            icon: "⚠️"
        });
    },
    info: (message) => {
        toast.info(message, {
            ...toastConfig,
            style: {
                background: '#ffffff',
                borderLeft: '4px solid #2196f3',
                color: '#333333',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px'
            },
            icon: "ℹ️"
        });
    },
    note: (message, color = '#ffeb3b') => {
        toast(message, {
            ...toastConfig,
            style: {
                background: color,
                borderRadius: '8px',
                color: '#333333',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            },
            icon: "📝"
        });
    }
};