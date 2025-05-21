import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import Layout from "../Layout";
import { useAxiosPrivate } from "../../utils/axios";
import ReactLoading from "react-loading";
import { MapPin, Globe, Linkedin, Building2, ArrowLeft, SquareArrowOutUpRight } from "lucide-react";

export default function ViewModal() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const fetchCompany = async () => {
    const { data } = await axiosPrivate.get(`/companies/${id}`);
    return data;
  };

  const { data: company, isLoading } = useQuery(
    ["company", { id }],
    fetchCompany,
    {
      enabled: !!id,
    }
  );

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4">
        <div className="flex items-center gap-2 pb-4 border-b-2">
          <Link
            to="/companies"
            className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={19} />
          </Link>
          <h1 className="text-lg font-semibold">Company Details</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <ReactLoading
              type="bubbles"
              color="#7571F9"
              height={50}
              width={50}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex shadow rounded-md p-4 gap-8 w-fit">
              <div className="flex gap-4">
                <div className="border rounded-md w-fit p-2 text-primary">
                  <Building2 size={40} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="gap-1 flex">
                    <span className="text-gray-600">Company:</span>
                    {company?.name}
                  </div>
                  <div className="gap-1 flex">
                    <span className="text-gray-600">Location:</span>
                    {company?.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                {company?.careersLink && (
                  <a
                    className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                    href={company?.careersLink}
                    target="_blank"
                    title="Careers Page"
                  >
                    <SquareArrowOutUpRight size={20} />
                  </a>
                )}
                {company?.linkedinLink && (
                  <a
                    className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                    href={company?.linkedinLink}
                    target="_blank"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 