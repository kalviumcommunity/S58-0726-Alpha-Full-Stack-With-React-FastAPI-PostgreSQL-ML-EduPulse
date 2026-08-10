from fastapi import Depends, HTTPException
from app.dependencies.auth_dependency import get_current_user

def require_role(role: str):
    def role_checker(user = Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return user

    return role_checker