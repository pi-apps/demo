autoReorder(productId) {
   if(stock < threshold) {
       createSupplierOrder()
       notifyAdmin()
       lockHighRiskItems()
   }
}
