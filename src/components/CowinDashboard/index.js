import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {cowinData: '', apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    const formatData = data => ({
      lastSevenDaysVaccination: data.last_7_days_vaccination.map(each => ({
        date: each.vaccine_date,
        firstDose: each.dose_1,
        secondDose: each.dose_2,
      })),
      vaccinationByAge: data.vaccination_by_age,
      vaccinationByGender: data.vaccination_by_gender,
    })

    try {
      if (response.ok === true) {
        const data = await response.json()
        console.log(data)
        const formattedData = formatData(data)
        this.setState({
          apiStatus: apiStatusConstants.success,
          cowinData: formattedData,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (err) {
      console.log(err)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderCowinData = () => {
    const {apiStatus, cowinData} = this.state
    return (
      <>
        <div className="chart-container">
          <h2 className="chart-heading">Vaccination Coverage</h2>
          <VaccinationCoverage
            vaccinationData={cowinData.lastSevenDaysVaccination}
          />
        </div>
        <div className="chart-container">
          <h2 className="chart-heading">Vaccination by gender</h2>
          <div className="pie-chart-container">
            <VaccinationByGender
              vaccinationData={cowinData.vaccinationByGender}
            />
          </div>
        </div>

        <div className="chart-container">
          <h2 className="chart-heading">Vaccination by age</h2>
          <VaccinationByAge vaccinationData={cowinData.vaccinationByAge} />
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="failure-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderCowinData()

      default:
        return ''
    }
  }

  render() {
    const {apiStatus, cowinData} = this.state

    return (
      <div className="app-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="main-heading">Co-WIN</h1>
        </div>
        <h2 className="sub-heading">CoWin Vaccination in India </h2>
        {this.renderResult()}
      </div>
    )
  }
}

export default CowinDashboard
