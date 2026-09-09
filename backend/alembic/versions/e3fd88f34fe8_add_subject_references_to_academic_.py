"""add subject references to academic records

Revision ID: e3fd88f34fe8
Revises: 05010a9fc5a4
Create Date: 2026-09-09 09:29:06.528018

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e3fd88f34fe8"
down_revision: Union[str, Sequence[str], None] = "05010a9fc5a4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("assignments", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("subject_id", sa.Integer(), nullable=True)
        )
        batch_op.create_index(
            "ix_assignments_subject_id",
            ["subject_id"],
            unique=False,
        )
        batch_op.create_foreign_key(
            "fk_assignments_subject_id_subjects",
            "subjects",
            ["subject_id"],
            ["id"],
        )

    with op.batch_alter_table("attendance", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("subject_id", sa.Integer(), nullable=True)
        )
        batch_op.create_index(
            "ix_attendance_subject_id",
            ["subject_id"],
            unique=False,
        )
        batch_op.create_foreign_key(
            "fk_attendance_subject_id_subjects",
            "subjects",
            ["subject_id"],
            ["id"],
        )

    with op.batch_alter_table("exams", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("subject_id", sa.Integer(), nullable=True)
        )
        batch_op.create_index(
            "ix_exams_subject_id",
            ["subject_id"],
            unique=False,
        )
        batch_op.create_foreign_key(
            "fk_exams_subject_id_subjects",
            "subjects",
            ["subject_id"],
            ["id"],
        )


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("exams", schema=None) as batch_op:
        batch_op.drop_constraint(
            "fk_exams_subject_id_subjects",
            type_="foreignkey",
        )
        batch_op.drop_index("ix_exams_subject_id")
        batch_op.drop_column("subject_id")

    with op.batch_alter_table("attendance", schema=None) as batch_op:
        batch_op.drop_constraint(
            "fk_attendance_subject_id_subjects",
            type_="foreignkey",
        )
        batch_op.drop_index("ix_attendance_subject_id")
        batch_op.drop_column("subject_id")

    with op.batch_alter_table("assignments", schema=None) as batch_op:
        batch_op.drop_constraint(
            "fk_assignments_subject_id_subjects",
            type_="foreignkey",
        )
        batch_op.drop_index("ix_assignments_subject_id")
        batch_op.drop_column("subject_id")
