import UserPositionModel, {UserPosition} from "../../data/UserPosition";
import UserModel, {User} from "../../data/User";
import {GraphUserPosition} from "./graphql";
import {Types} from "mongoose";
import {converter as userConverter} from "./UserFacade";

export async function convertOne(position: UserPosition): Promise<GraphUserPosition> {
    if (!position)
        return undefined;

    return (await convertMany([position]))[0];
}

export async function convertMany(positions: UserPosition[]): Promise<GraphUserPosition[]> {

    if (positions.length < 1)
        return [];

    const usersToRetrieve = positions.reduce((acc, position) => {
        acc.add(position.user);
        return acc;
    }, new Set<Types.ObjectId>());

    const retrievedUsers = (await UserModel.find({
        _id: {
            $in: Array.from(usersToRetrieve)
        }
    }).lean().exec()).reduce((acc: { [key: string]: User }, u: User) => {
        acc[u._id.toHexString()] = u;
        return acc;
    }, {});

    return positions.map(position => ({
        user: userConverter(retrievedUsers[position.user.toHexString()]),
        longitude: position.position.coordinates[0],
        latitude: position.position.coordinates[1],
        timestamp: position.created.toDateString()
    }));
}

export default class PositionFacade {
    static async updateUserPosition(user: string, longitude: number, latitude: number) {
        await UserPositionModel.deleteMany({user}).exec();

        return convertOne(await UserPositionModel.create({
            user,
            position: {
                coordinates: [longitude, latitude]
            }
        }));
    }

    static async getNearbyUsers(user: string, radiusMeters: number) {

        const ownPosition = await PositionFacade.getUserPosition(user);
        if (!ownPosition)
            return [];

        return convertMany(await UserPositionModel.find({
            user: {$ne: user},
            position: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [ownPosition.longitude, ownPosition.latitude]
                    },
                    $maxDistance: radiusMeters
                }
            }
        }).lean().exec());
    }

    static async getUserPosition(user: string) {
        return convertOne(await UserPositionModel.findOne({user}));
    }
}