from fastapi import APIRouter

router = APIRouter()

@router.get("/fraud/score")
def score(user_id: str):
    return {
        "risk_score": 72,
        "status": "medium",
        "recommendation": "review manually"
    }
