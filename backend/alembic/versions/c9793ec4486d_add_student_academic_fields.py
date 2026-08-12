"""add student academic fields

Revision ID: c9793ec4486d
Revises:
Create Date: 2026-08-12 13:59:58.118296

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c9793ec4486d"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Fill the existing student record with valid values.
    op.execute(
        """
        UPDATE students
        SET
            student_id = 'STU001',
            department = 'Computer Science',
            year = 3,
            semester = 6
        WHERE student_id IS NULL
        """
    )

    # Make the new fields mandatory.
    with op.batch_alter_table("students") as batch_op:

        batch_op.alter_column(
            "student_id",
            existing_type=sa.String(),
            nullable=False
        )

        batch_op.alter_column(
            "department",
            existing_type=sa.String(),
            nullable=False
        )

        batch_op.alter_column(
            "year",
            existing_type=sa.Integer(),
            nullable=False
        )

        batch_op.alter_column(
            "semester",
            existing_type=sa.Integer(),
            nullable=False
        )

        batch_op.alter_column(
            "name",
            existing_type=sa.String(),
            nullable=False
        )

        batch_op.alter_column(
            "email",
            existing_type=sa.String(),
            nullable=False
        )

        batch_op.create_index(
            "ix_students_department",
            ["department"],
            unique=False
        )

        batch_op.create_index(
            "ix_students_student_id",
            ["student_id"],
            unique=True
        )


def downgrade() -> None:
    """Downgrade schema."""

    with op.batch_alter_table("students") as batch_op:

        batch_op.drop_index(
            "ix_students_student_id"
        )

        batch_op.drop_index(
            "ix_students_department"
        )

        batch_op.alter_column(
            "email",
            existing_type=sa.String(),
            nullable=True
        )

        batch_op.alter_column(
            "name",
            existing_type=sa.String(),
            nullable=True
        )

        batch_op.alter_column(
            "student_id",
            existing_type=sa.String(),
            nullable=True
        )

        batch_op.alter_column(
            "department",
            existing_type=sa.String(),
            nullable=True
        )

        batch_op.alter_column(
            "year",
            existing_type=sa.Integer(),
            nullable=True
        )

        batch_op.alter_column(
            "semester",
            existing_type=sa.Integer(),
            nullable=True
        )