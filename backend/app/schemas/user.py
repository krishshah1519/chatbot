from pydantic import BaseModel, EmailStr

class BaseUser(BaseModel):
    username:str
    email: EmailStr

class CreateUser(BaseUser):
    password:str


class UserOut(BaseUser):
    id: str

    class Config:
        from_attributes = True
