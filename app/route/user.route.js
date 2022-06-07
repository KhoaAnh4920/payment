module.exports = function (app) {

    const user = require('../controller/user.controller.js');
    app.post('/api/get-momo-payment-link', user.getMomoPaymentLink);
    app.post('/api/handle-order', user.handleOrderPayment);
    app.post('/api/callback-order-status', user.handleCallbackOrderStatus);

    app.post('/api/handle-create-order', user.handleCreateOrderShipping);
    app.post('/api/print-code-shipping', user.printCodeShipping);
    app.post('/api/cancel-code-shipping', user.cancelCodeShipping);

    app.post('/api/get-list-status', user.getListStatusByOrderIds);

    app.get('/api/get-dashboard', user.getDashboards);
    app.post('/api/update-number-of-access', user.updateNumberOfAccess);
};
