"""
Multimodal Attendance & Engagement Agent - Flask Application
Skillwallet Project Backend.

Exposes RESTful APIs for:
- Student management (/api/students)
- Session creation and tracking (/api/sessions)
- Attendance marking and audit logs (/api/sessions/<id>/attendance)
- Analytics, metrics, and CSV export (/api/analytics)
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db
from routes.students import students_bp
from routes.sessions import sessions_bp
from routes.attendance import attendance_bp
from routes.analytics import analytics_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Initialize SQLite database on startup
    init_db()

    # Register blueprints
    app.register_blueprint(students_bp)
    app.register_blueprint(sessions_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(analytics_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Multimodal Attendance & Engagement Agent API",
            "version": "1.0.0",
            "database": "SQLite3"
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Requested resource was not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"success": False, "error": "An internal server error occurred"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
