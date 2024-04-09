# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class UserProfile(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address_amphur: DF.Data | None
		address_district: DF.Data | None
		address_moo: DF.Data | None
		address_no: DF.Data | None
		address_province: DF.Data | None
		address_road: DF.Data | None
		address_soi: DF.Data | None
		birthdate: DF.Date | None
		email: DF.Data | None
		fullname: DF.Data | None
		nationality: DF.Data | None
		race: DF.Data | None
		tel: DF.Data | None
	# end: auto-generated types
	pass
