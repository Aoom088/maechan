# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class RequestType(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.maechan_core.doctype.attachment.attachment import Attachment
		from maechan.maechan_core.doctype.checklist.checklist import CheckList
		from maechan.maechan_core.doctype.checklisttypedetail.checklisttypedetail import CheckListTypeDetail
		from maechan.maechan_core.doctype.requesttypedetail.requesttypedetail import RequestTypeDetail

		attachment: DF.Table[Attachment]
		checklist: DF.Table[CheckList]
		checklist_details: DF.Table[CheckListTypeDetail]
		details: DF.Table[RequestTypeDetail]
		request_type: DF.Data | None
	# end: auto-generated types
	pass
