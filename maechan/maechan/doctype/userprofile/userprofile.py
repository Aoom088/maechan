# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class UserProfile(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address_amphur: DF.Link | None
		address_district: DF.Link | None
		address_moo: DF.Data | None
		address_no: DF.Data | None
		address_province: DF.Link | None
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

	def autoname(self):
		self.name = frappe.session.user

	def before_insert(self):
		self.email = frappe.session.user


@frappe.whitelist()
def get_current_userprofile():
	profile =  frappe.db.get("UserProfile", {
		"name" : frappe.session.user
	})

	if profile :
		return profile
	else : 
		return frappe.new_doc("UserProfile",as_dict=True)
	

@frappe.whitelist()
def update_or_create_userprofile():
	
	req = frappe.form_dict
	assert 'profile' in req
	profilereq = req['profile']
	if 'doctype' not in profilereq :
		profilereq['doctype'] = 'UserProfile'

	profile = frappe.get_doc(req['profile'])
	profile.save()

	return profile