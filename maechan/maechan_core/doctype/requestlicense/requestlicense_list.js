// frappe.listview_settings['RequestLicense'] = {
//     onload(){
//         frappe.breadcrumbs.clear();
//     } 
// }

frappe.listview_settings['RequestLicense'] = {
    ...frappe.listview_settings['RequestLicense'],
    onload() {
        frappe.breadcrumbs.clear();
    }
}