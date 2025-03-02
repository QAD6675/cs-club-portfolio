import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  auth,
  getActivities,
  updateActivity,
  deleteActivity,
  addActivity,
} from "../firebase";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editActivity, setEditActivity] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Function to determine status based on date
  const determineStatus = (activityDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const date = new Date(activityDate);
    date.setHours(0, 0, 0, 0); // Reset time to start of day

    // Convert dates to timestamps for comparison
    const todayTime = today.getTime();
    const dateTime = date.getTime();

    if (dateTime === todayTime) {
      return "ongoing";
    } else if (dateTime < todayTime) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  // Get status label and class name
  const getStatusLabel = (activity) => {
    const status = determineStatus(activity.date);
    switch (status) {
      case "upcoming":
        return { label: "Upcoming", className: "status-upcoming" };
      case "completed":
        return { label: "Completed", className: "status-completed" };
      case "ongoing":
        return { label: "Today", className: "status-ongoing" };
      default:
        return { label: "Unknown", className: "status-unknown" };
    }
  };

  useEffect(() => {
    loadActivities();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const loadActivities = async () => {
    try {
      const activitiesList = await getActivities();
      // Sort activities by date
      const sortedActivities = activitiesList.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setActivities(sortedActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const handleAdd = () => {
    setEditActivity({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      registrationLink: "",
    });
    setIsAddingNew(true);
    setEditMode(true);
  };

  const handleEdit = (activity) => {
    setEditActivity({ ...activity });
    setIsAddingNew(false);
    setEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // The status will be determined automatically based on the date
      const activityToSave = {
        ...editActivity,
        // Remove status field as it will be determined automatically
        status: undefined,
      };

      if (isAddingNew) {
        await addActivity(activityToSave);
      } else {
        await updateActivity(activityToSave.id, activityToSave);
      }
      setEditMode(false);
      setEditActivity(null);
      setIsAddingNew(false);
      loadActivities();
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(id);
        loadActivities();
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  const renderEditForm = () => {
    return (
      <form onSubmit={handleSave} className="activity-edit-form">
        <h3>{isAddingNew ? "Add New Activity" : "Edit Activity"}</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={editActivity.title || ""}
            onChange={(e) =>
              setEditActivity({ ...editActivity, title: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={editActivity.description || ""}
            onChange={(e) =>
              setEditActivity({ ...editActivity, description: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={editActivity.date || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setEditActivity({ ...editActivity, date: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={editActivity.location || ""}
            onChange={(e) =>
              setEditActivity({ ...editActivity, location: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Registration Link (optional):</label>
          <input
            type="url"
            value={editActivity.registrationLink || ""}
            onChange={(e) =>
              setEditActivity({
                ...editActivity,
                registrationLink: e.target.value,
              })
            }
          />
        </div>
        <div className="button-group">
          <button type="submit" className="save-button">
            Save Activity
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditMode(false);
              setEditActivity(null);
              setIsAddingNew(false);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h2>Club Activities</h2>
        {isAdmin && (
          <button className="add-button" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Add Activity
          </button>
        )}
      </div>

      {editMode ? (
        renderEditForm()
      ) : (
        <div className="activities-grid">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const statusInfo = getStatusLabel(activity);
              return (
                <div key={activity.id} className="activity-card">
                  <h3>{activity.title}</h3>
                  <div className="activity-meta">
                    <div className="activity-date">
                      <FontAwesomeIcon icon={faCalendar} />
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                    <div className={`activity-status ${statusInfo.className}`}>
                      {statusInfo.label}
                    </div>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-location">
                    <strong>Location:</strong> {activity.location}
                  </div>
                  {activity.registrationLink && (
                    <div className="activity-registration">
                      <a
                        href={activity.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="registration-link"
                      >
                        Register Now
                      </a>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="admin-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(activity)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-activities-message">
              <p>
                No activities available.{" "}
                {isAdmin && "Click 'Add Activity' to create one."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Activities;
