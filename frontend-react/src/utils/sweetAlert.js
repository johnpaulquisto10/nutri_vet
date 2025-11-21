import Swal from 'sweetalert2';

const swalConfig = {
    customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 rounded-lg font-medium',
        cancelButton: 'px-6 py-3 rounded-lg font-medium'
    },
    buttonsStyling: false
};

export const confirmDelete = (itemName = 'item') => {
    return Swal.fire({
        ...swalConfig,
        title: `Delete ${itemName}?`,
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });
};

export const confirmApprove = (id, requireNotes = false) => {
    return Swal.fire({
        ...swalConfig,
        title: 'Approve Application?',
        html: `Application ID: <b>#${id}</b><br>Farmer will be notified via email.`,
        icon: 'question',
        input: 'textarea',
        inputLabel: requireNotes ? 'Admin Notes *' : 'Admin Notes (Optional)',
        inputPlaceholder: 'Add notes about this approval...',
        inputValidator: requireNotes ? (value) => {
            if (!value) return 'Please provide notes'
        } : undefined,
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        confirmButtonText: 'Yes, Approve',
        cancelButtonText: 'Cancel'
    });
};

export const confirmReject = (id) => {
    return Swal.fire({
        ...swalConfig,
        title: 'Reject Application?',
        html: `Application ID: <b>#${id}</b><br>Please provide a reason for rejection.`,
        icon: 'warning',
        input: 'textarea',
        inputLabel: 'Reason for Rejection *',
        inputPlaceholder: 'Explain why this application is rejected...',
        inputValidator: (value) => {
            if (!value) return 'Please provide a reason for rejection'
        },
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Yes, Reject',
        cancelButtonText: 'Cancel'
    });
};

export const confirmResolve = (id) => {
    return Swal.fire({
        ...swalConfig,
        title: 'Mark as Resolved?',
        html: `Report ID: <b>#${id}</b><br>Mark this disease report as resolved?`,
        icon: 'success',
        input: 'textarea',
        inputLabel: 'Resolution Notes',
        inputPlaceholder: 'Describe how this issue was resolved...',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        confirmButtonText: 'Mark Resolved',
        cancelButtonText: 'Cancel'
    });
};

export const confirmLogout = () => {
    return Swal.fire({
        ...swalConfig,
        title: 'Logout?',
        text: "Are you sure you want to end your session?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Stay logged in'
    });
};

export const successAlert = (title, text = '', html = null) => {
    return Swal.fire({
        ...swalConfig,
        icon: 'success',
        title: title,
        text: html ? undefined : text,
        html: html,
        confirmButtonColor: '#22c55e',
        confirmButtonText: 'OK'
    });
};

export const errorAlert = (title, text) => {
    return Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK'
    });
};

export const loadingAlert = (title = 'Processing...') => {
    return Swal.fire({
        title: title,
        html: 'Please wait...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

export default Swal;
