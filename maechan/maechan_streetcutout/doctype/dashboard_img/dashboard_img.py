# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from typing import List
import frappe
import frappe.utils
from frappe.model.document import Document


class DashboardIMG(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		dashboard_img: DF.AttachImage
		dashboard_img_link: DF.Data | None
	# end: auto-generated types

	pass 

@frappe.whitelist()
def load_dashboard_imgs():
    query = """
        select 
            tabDashboardIMG.*
        from tabDashboardIMG
    """

    result = frappe.db.sql(query, as_dict=True)  
    return {'data': result}  