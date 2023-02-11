import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "./Profile.module.scss";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Selector from "../../components/Selector";

export default function Profile() {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user);
  const [tempUser, setTempUser] = useState(user);
  const [pageNumber, setPageNumber] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTempUser(user.user);
  }, [user]);

  const handleNext = (e) => {
    e.preventDefault();
    setPageNumber(pageNumber + 1);
  };

  const handleChange = (e) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handleSelect = (name, value) => {
    setTempUser({ ...tempUser, [name]: value });
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setPageNumber(pageNumber - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saving) return;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      ...tempUser,
      first_update_date: new Date().toISOString().split("T")[0],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    setSaving(true);
    fetch("https://homestretch-api.onrender.com/users/profile", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setSaving(false);
        if (result.message === "Success") {
          setPageNumber(pageNumber + 1);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      {user.first_update_date == null && (
        <div className={style.main}>
          <div className="">
            <img src="https://i.ibb.co/d0T7zsC/homestretch.png" alt="logo" />
            {pageNumber !== 0 && <h2>Welcome to Homestretch</h2>}
            <p>
              Please Complete Your Profile for a More Personalized Experience!
            </p>
          </div>
          <form style={{ height: [0, 4].includes(pageNumber) ? "100%" : "" }}>
            {pageNumber === 0 && (
              <div>
                <h2>Welcome to Homestretch</h2>
                <p>
                  For a more personalized experience tailored to your needs, we
                  recommend completing your profile in the next step. We take
                  user privacy seriously and will never share your information
                  (or any of our user’s personally identifying information)
                  outside HomeStretch for any reason without your explicit
                  consent
                </p>
                <button className={style.button} onClick={(e) => handleNext(e)}>
                  Get Started
                </button>
              </div>
            )}
            {pageNumber > 0 && pageNumber < 4 && (
              <>
                <div className={style.header}>
                  <div>
                    {pageNumber > 1 && (
                      <button
                        className={style.button_alt}
                        onClick={(e) => handlePrevious(e)}
                      >
                        <BiChevronLeft />
                        Previous
                      </button>
                    )}
                    <span>Section {pageNumber} / 3</span>
                  </div>
                  <div
                    className={style.progress}
                    style={{
                      backgroundImage: `linear-gradient(to right, #4143E2 ${
                        pageNumber * 33.3
                      }%, #C3D3F3
 ${pageNumber * 33.3}%)`,
                    }}
                  ></div>
                  <h1>{pageNumber === 1 && "Personal Information"}</h1>
                </div>
              </>
            )}
            {pageNumber > 0 && pageNumber < 4 && (
              <div className={style.fields}>
                {pageNumber === 1 && (
                  <>
                    <div className={style.field}>
                      <label>First name</label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        name="fname"
                        value={tempUser.fname}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Last name</label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        name="lname"
                        value={tempUser.lname}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Email address</label>
                      <input
                        type="text"
                        placeholder="Enter your email address"
                        name="email"
                        value={tempUser.email}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Phone number</label>
                      <input
                        type="text"
                        placeholder="(+1)-xxx-xxx-xxxx"
                        name="phone"
                        value={tempUser.phone}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Date of birth</label>
                      <input
                        type="date"
                        name="birth_date"
                        value={tempUser.birth_date}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Are a veteran?</label>
                      <Selector
                        data={[{ id: "Yes" }, { id: "No" }]}
                        id="id"
                        title="id"
                        selectionChanged={(veteran_status) =>
                          handleSelect("veteran_status", veteran_status)
                        }
                        value={tempUser.veteran_status}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Homebuying status</label>
                      <Selector
                        data={[
                          { id: "Just Researching" },
                          { id: "Starting the Homebuying Process" },
                          { id: "Making Offers" },
                          { id: "Under Contract" },
                          { id: "Closed on a Home" },
                          { id: "Moving" },
                          { id: "Other" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(home_buying_status) =>
                          handleSelect("home_buying_status", home_buying_status)
                        }
                        value={tempUser.home_buying_status}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Race</label>
                      <Selector
                        data={[
                          { id: "American Indian or Alaska Native" },
                          { id: "Asian" },
                          { id: "Black or African American" },
                          { id: "Middle Eastern or North American" },
                          { id: "Native Hawaiian or other Pacific Islander" },
                          { id: "White" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(race) => handleSelect("race", race)}
                        value={tempUser.race}
                        fontFamily={"Inter"}
                      />
                    </div>
                  </>
                )}
                {pageNumber === 2 && (
                  <>
                    <div className={style.field}>
                      <label>What is your current occupation?</label>
                      <Selector
                        data={[
                          {
                            id: "Educator (including Teacher, Coach, Principals, etc)",
                          },
                          {
                            id: "Medical Personal/Healthcare Workers (including Doctors, Nurses, Phlebotomists, Technicians,etc)",
                          },
                          { id: "Firefighter and EMS" },
                          { id: "Military Personnel" },
                          { id: "Other " },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(employment_status) =>
                          handleSelect("employment_status", employment_status)
                        }
                        value={tempUser.employment_status}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>What is your current income?</label>
                      <Selector
                        data={[
                          { id: "$0 - 20,000" },
                          { id: "$20,000 - $30,000" },
                          { id: "$30,000 - $40,000" },
                          { id: "$40,000 - $50,000" },
                          { id: "$50,000 - $60,000" },
                          { id: "$60,000 - $70,000" },
                          { id: "$70,000 - $80,000" },
                          { id: "$80,000 - $90,000" },
                          { id: "$90,000 - $100,000" },
                          { id: "$100,000 - $110,000" },
                          { id: "$110,000 - $120,000" },
                          { id: "$120,000 - $130,000" },
                          { id: "$130,000 - $140,000" },
                          { id: "$140,000 - $150,000" },
                          { id: "$150,000+" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(income) =>
                          handleSelect("income", income)
                        }
                        value={tempUser.income}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>What is your debt-to-income ratio?</label>
                      <Selector
                        data={[
                          { id: "0% - 5%" },
                          { id: "5% - 10%" },
                          { id: "10% - 15%" },
                          { id: "15% - 20%" },
                          { id: "20% - 25%" },
                          { id: "25% - 30%" },
                          { id: "30% - 35%" },
                          { id: "35% - 40%" },
                          { id: "40% - 45%" },
                          { id: "45% and above" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(debt_to_income) =>
                          handleSelect("debt_to_income", debt_to_income)
                        }
                        value={tempUser.debt_to_income}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>What is your current credit score?</label>
                      <Selector
                        data={[
                          { id: "Under 500" },
                          { id: "500 - 579" },
                          { id: "580 - 619" },
                          { id: "620 - 639" },
                          { id: "640 - 679" },
                          { id: "680 - 719" },
                          { id: "720 and above" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(credit_score) =>
                          handleSelect("credit_score", credit_score)
                        }
                        value={tempUser.credit_score}
                        fontFamily={"Inter"}
                      />
                    </div>
                  </>
                )}
                {pageNumber === 3 && (
                  <>
                    <div className={style.field}>
                      <label>
                        When are you planning to make your purchase?
                      </label>
                      <Selector
                        data={[
                          { id: "Within 6 month" },
                          { id: "Within a year" },
                          { id: "Not sure" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(when) => handleSelect("when", when)}
                        value={tempUser.when}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>What kind of home are you looking for??</label>
                      <Selector
                        data={[
                          { id: "Studio" },
                          { id: "Apartment" },
                          { id: "House" },
                          { id: "Other" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(house_type) =>
                          handleSelect("house_type", house_type)
                        }
                        value={tempUser.house_type}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>How much do you plan to spend on a home?</label>
                      <Selector
                        data={[
                          { id: "less than $50,000" },
                          { id: "$50,000 - $100,000" },
                          { id: "$100,000 - $200,000" },
                          { id: "$200,000 - $500,000" },
                          { id: "$500,000 - $1000,000" },
                          { id: "more than $1,000,000" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(budget) =>
                          handleSelect("budget", budget)
                        }
                        value={tempUser.budget}
                        fontFamily={"Inter"}
                      />
                    </div>
                    <div className={style.field}>
                      <label>Where are you looking for a home?</label>
                      <Selector
                        data={[
                          { id: "Down town" },
                          { id: "City center" },
                          { id: "Other" },
                        ]}
                        id="id"
                        title="id"
                        selectionChanged={(Where) =>
                          handleSelect("Where", Where)
                        }
                        value={tempUser.Where}
                        fontFamily={"Inter"}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            {pageNumber > 0 && pageNumber < 4 && (
              <div className={style.footer}>
                {pageNumber !== 3 && (
                  <>
                    <button
                      className={style.button}
                      onClick={(e) => handleNext(e)}
                    >
                      Next
                      <BiChevronRight />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/";
                      }}
                      className={style.button_alt}
                    >
                      Continue later
                    </button>
                  </>
                )}
                {pageNumber === 3 && (
                  <>
                    <button
                      className={`${style.button} ${
                        saving ? style.saving : ""
                      }`}
                      onClick={(e) => handleSubmit(e)}
                      style={{ width: "150px" }}
                    >
                      {saving ? "Submitting ..." : "Finish"}
                    </button>
                  </>
                )}
              </div>
            )}
            {pageNumber === 4 && (
              <div>
                <p>
                  Your information was successfully submitted. Please click{" "}
                  <a href="/">here</a> to go to the home page.
                </p>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}
