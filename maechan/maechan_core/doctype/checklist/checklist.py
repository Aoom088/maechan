# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class CheckList(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		comment: DF.Data | None
		key: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		title_detail: DF.Data
		value: DF.Literal["-", "\u0e1c\u0e48\u0e32\u0e19", "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19"]
	# end: auto-generated types
	pass
