from fastapi import FastAPI
from fastapi import FastAPI
from database import supabase

app = FastAPI()


@app.get("/")
def home():
    return {"message": "PocketWise Backend Running"}


@app.get("/api/users")
def get_users():

    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return response.data
@app.get("/api/transactions")
def get_transactions():

    response = (
        supabase
        .table("transactions")
        .select("*")
        .execute()
    )

    return response.data
@app.get("/api/budgets")
def get_budgets():

    response = (
        supabase
        .table("budgets")
        .select("*")
        .execute()
    )

    return response.data
@app.get("/api/financial-scores")
def get_scores():

    response = (
        supabase
        .table("financial_scores")
        .select("*")
        .execute()
    )

    return response.data
@app.get("/api/insights")
def get_insights():

    response = (
        supabase
        .table("insights")
        .select("*")
        .execute()
    )

    return response.data
@app.get("/api/reports")
def get_reports():

    response = (
        supabase
        .table("financial_reports")
        .select("*")
        .execute()
    )

    return response.data